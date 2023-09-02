import hashlib
import re
import os
import json
from fastapi import FastAPI, Depends, Request, HTTPException
from starlette.responses import RedirectResponse
from pydantic import BaseModel, create_model
from sqlalchemy import or_, and_, select
from sqlalchemy.orm import Session
from database import SessionLocal, engine
import models
from typing import Union
import redis
from redis import Redis
from cache import pool
from slowapi import Limiter, _rate_limit_exceeded_handler
from slowapi.util import get_remote_address
from slowapi.errors import RateLimitExceeded
from dotenv import load_dotenv
from fastapi.middleware.cors import CORSMiddleware

load_dotenv()
models.Base.metadata.create_all(bind=engine)

def get_limiter_key(request: Request):
    current_key = request.scope.get("client")[0]
    request_headers = request.scope.get("headers")
    limiter_prefix = request.scope.get("root_path") + request.scope.get("path") + ":"

    for headers in request_headers:
        if headers[0].decode() == "authorization":
            current_key = headers[1].decode()
            break
        if headers[0].decode() in ("user-agent", "x-real-ip"):
            current_key += headers[1].decode()

    hash_object = hashlib.sha256(current_key.encode())
    current_key = hash_object.hexdigest()
    limiter_key = re.sub(r":{1,}", ":", re.sub(r"/{1,}", ":", limiter_prefix + current_key))
    return limiter_key

limiter = Limiter(key_func=get_limiter_key, storage_uri=os.environ['REDIS_URL'])
app = FastAPI()
app.state.limiter = limiter
app.add_exception_handler(RateLimitExceeded, _rate_limit_exceeded_handler)

app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
)

def get_db():
    db = SessionLocal()
    try:
        yield db
    finally:
        db.close()

def get_redis():
  return redis.Redis(connection_pool=pool)

class CardSchema(BaseModel):
    id: int
    season: int
    name: str
    type: str
    motto: str
    category: str
    region: str
    flag: str
    cardcategory: str
    description: str
    badges: Union[list, dict]
    trophies: Union[list, dict]

@app.get("/")
def redirectHome():
    return RedirectResponse("https://sideroca.com/docs")

@app.get("/health")
async def health_check():
    return {"status": "healthy"}

ALLOWED_PARAMS = {
    "season", "type", "name", "motto", "category", "region", "deck", "collection",
    "flag", "cardcategory", "badges", "trophies", "mode", "rarity", "exnation"
}

@app.get("/cards")
@limiter.limit("30/minute")
async def index(
    request: Request,
    db: Session = Depends(get_db),
    cache: Union[Redis, None] = Depends(get_redis),
    season: int | str | None = None,
    type: str | None = None,
    name: str | None = None,
    motto: str | None = None,
    category: str | None = None,
    region: str | None = None,
    flag: str | None = None,
    cardcategory: str | None = None,
    badges: str | None = None,
    trophies: str | None = None,
    mode: str | None = None,
    rarity: str | None = None,
    exnation: str | None = None
):
    status_code = 200
    detail = "Query parameters are valid."
    try:
        invalid_params = set(request.query_params.keys()) - ALLOWED_PARAMS
        if invalid_params:
            status_code = 400
            detail = f"Invalid query parameter(s): {', '.join(invalid_params)}"
            raise HTTPException(status_code=status_code, detail=detail)

        if rarity:
            cardcategory = rarity
        if all(value is None for value in request.query_params.keys()):
            return {"cards": []}
        cached_response = cache.get(str(request.query_params))
        if cached_response:
            return json.loads(cached_response)
        else:
            sans_queries = []
            or_badges_queries = []
            and_badges_queries = []
            match_queries = []
            for param in request.query_params:
                if (param in ('badges', 'trophies')):
                    value = request.query_params[param]
                    values = value.split(",") if value else []
                    if len(values) == 1 and "sans" in values:
                        sans_queries.append(getattr(models.Card, param) == {})
                    else:
                        or_badges = []
                        and_badges = []
                        for value in values:
                            elements = value.split("|")
                            if len(values) == 1:
                                or_badges.extend(elements)
                                break
                            and_badges.append(elements[0])
                            if len(elements) > 1:
                                or_badges.append(elements[1])
                        format_or_badges = []
                        for badge in or_badges:
                            formatted_words = []
                            for word in badge.split('_'):
                                if param == 'badges':
                                    if word[0].isalpha():
                                        formatted_words.append(word.capitalize())
                                    else:
                                        formatted_words.append(word[0] + word[1].capitalize() + word[2:])
                                else:
                                    if '-' not in word:
                                        format_or_badges.append(f"{word.upper()}-1")
                                        format_or_badges.append(f"{word.upper()}-5")
                                        format_or_badges.append(f"{word.upper()}-10")
                                    else:
                                        formatted_words.append(word.upper())
                                        format_or_badges.append(' '.join(formatted_words))
                            format_or_badges.append(' '.join(formatted_words))
                        format_and_badges = []
                        for badge in and_badges:
                            formatted_words = []
                            for word in badge.split('_'):
                                if param == 'badges':
                                    if word[0].isalpha():
                                        formatted_words.append(word.capitalize())
                                    else:
                                        formatted_words.append(word[0] + word[1].capitalize())
                                else:
                                    if '-' not in word:
                                        format_or_badges.append(f"{word.upper()}-1")
                                        format_or_badges.append(f"{word.upper()}-5")
                                        format_or_badges.append(f"{word.upper()}-10")
                                    else:
                                        formatted_words.append(word.upper())
                                        format_and_badges.append(' '.join(formatted_words))
                        if 'sqlite' in os.environ['DATABASE_URL']:
                            or_badges_queries = [~(getattr(models.Card, param)[badge[1:]]) if badge.startswith('!') else getattr(models.Card, param)[badge] for badge in format_or_badges]
                            and_badges_queries = [~(getattr(models.Card, param)[badge[1:]]) if badge.startswith('!') else getattr(models.Card, param)[badge] for badge in format_and_badges]
                        else:
                            or_badges_queries = [~(getattr(models.Card, param).op("?")(badges[1:])) if badge.startswith('!') else getattr(models.Card, param).op("?")(badge) for badge in format_or_badges]
                            and_badges_queries = [~(getattr(models.Card, param).op("?")(badges[1:])) if badge.startswith('!') else getattr(models.Card, param).op("?")(badge) for badge in format_and_badges]

                if param in ('name', 'type', 'region', 'flag', 'motto'):
                    value = request.query_params[param]
                    values = value.split(",") if value else []
                    if value.startswith('=') or '!=' in value:
                        formatted_values = [~getattr(models.Card, param) == value[2:] if value is not None and value.startswith('!') else getattr(models.Card, param) == value[1:] if value is not None else True for value in values]
                        match_queries.append(*formatted_values)
                    else:
                        formatted_values = [~getattr(models.Card, param).ilike(f"%{value[1:].replace(' ', '_')}%") if value is not None and value.startswith('!') else getattr(models.Card, param).ilike(f"%{value.replace(' ', '_')}%") if value is not None else True for value in values]
                        match_queries.append(or_(*formatted_values) if formatted_values is not None else True)

                if param in ('category', 'cardcategory'):
                    value = request.query_params[param]
                    values = value.split(",") if value else []
                    if param == 'category':
                        values = [' '.join(word.capitalize() if word[0].isalpha() else word[0] + word[1].capitalize() + word[2:] for word in value.split('_')) for value in values]
                    formatted_values = [~(getattr(models.Card, param) == value[1:]) if value is not None and value.startswith('!') else getattr(models.Card, param) == value if value is not None else True for value in values]
                    match_queries.append(or_(*formatted_values))
            query_finales = db.query(models.Card).filter(
                    models.Card.season != str(season[1:]) if str(season).startswith('!') else models.Card.season == str(season) if season is not None else True,
                    models.Card.region.is_(None) if exnation is not None else True,
                    *match_queries if match_queries is not None else True,
                    *sans_queries if sans_queries is not None else True,
                    or_(*or_badges_queries) if or_badges_queries is not None else True,
                    *and_badges_queries if and_badges_queries is not None else True,
            )

            if all(value is None for value in (name, type, motto, category, region, flag, badges, trophies, cardcategory)) and season is not None:
                mode = "names"
            
            if (mode is not None and mode == "names"):
                query_finales = query_finales.with_entities(models.Card.name, models.Card.id, models.Card.season).all()
                res_names = {"cards": [{"name": card.name, "id": card.id, "season": card.season} for card in query_finales]}
                cache.set(str(request.query_params), json.dumps(res_names))
                cache.expire(str(request.query_params), 3600)
                return res_names
            else:
                query_finales = query_finales.all()
                card_dicts = {"cards": [{key: getattr(card, key) for key in card.__table__.columns.keys()} for card in query_finales]}
                for card_dict in card_dicts["cards"]:
                    card_dict["link"] = f"https://www.nationstates.net/page=deck/card={card_dict['id']}/season={card_dict['season']}"
                if len(card_dicts["cards"]) > 12000:
                    filtered_card_dicts = {"cards": [{"name": card['name'], "id": card['id'], "season": card['season']} for card in card_dicts['cards']]}
                    cache.set(str(request.query_params), json.dumps(filtered_card_dicts))
                    cache.expire(str(request.query_params), 3600)
                    return filtered_card_dicts
                else:
                    cache.set(str(request.query_params), json.dumps(card_dicts))
                    cache.expire(str(request.query_params), 3600)
                    return card_dicts
    except HTTPException as http_exception:
        if http_exception.status_code != 400:
            http_exception.status_code = 500
            http_exception.detail = f"The server had trouble understanding your request: {http_exception.detail}"
        raise
    except Exception as e:
        print(f"Error in /cards endpoint: {e}")
        raise HTTPException(status_code=500, detail="The server had trouble understanding your request.")
        
@app.post("/collection")
@limiter.limit("30/minute")
async def index(request: Request, db: Session = Depends(get_db), cache: Union[Redis, None] = Depends(get_redis),):
    try:
        cards_in_collection = await request.json()
        cached_response = cache.get(str(request.query_params))
        if cached_response:
            return json.loads(cached_response)
        else:
            query_finales = []
            for card in cards_in_collection:
                query = db.query(models.Card).filter(
                    models.Card.id == card['CARDID'],
                    models.Card.season == card['SEASON'],
                    models.Card.cardcategory == card['CATEGORY']
                )
                query_finales.extend(query.all())
            card_dicts = {"cards": [{key: getattr(card, key) for key in card.__table__.columns.keys()} for card in query_finales] }
            for card_dict in card_dicts["cards"]:
                card_dict["link"] = f"https://www.nationstates.net/page=deck/card={card_dict['id']}/season={card_dict['season']}"
            cache.set(str(request.query_params), json.dumps(card_dicts))
            cache.expire(str(request.query_params), 3600)
            return card_dicts
    except Exception as e:
        print(f"Error in /cards endpoint: {e}")
        raise HTTPException(status_code=500, detail="The server had trouble understanding your request.")
