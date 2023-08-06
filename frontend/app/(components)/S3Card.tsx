import { Card } from "../(helpers)/models";
import { banners } from "../(helpers)/categories";
import { Badges } from "./Badges";
import { S2S3Description } from "./S2S3Description";

export function S3Card({ card, opt, url }: { card: Card, opt?: string, url?: string }) {
    return (
        <a href={url ? url : `https://www.nationstates.net/page=deck/card=${card.id}/season=${card.season}`} target="_blank" rel="noopener noreferrer">
            <div className={`deckcard-container ${card.inCollection !== undefined ? card.inCollection ? 'border-blue-400 border-2 border-solid' : 'border-red-600 border-2 border-solid' : ""}`}>
                <div className="deckcard deckcard-season-3" data-cardid={card.id} data-season="3">
                    <figure className={`front deckcard-category-${card.cardcategory}`}>
                        <div className="s3-content">
                            <div className="s3-upper">
                                <div className="s3-flagbox">
                                    <div className="s3-flag"><div className="s3-flag-image" style={{ backgroundImage: `${card.flag.includes('./') ? `url(${card.flag}` : `url(https://www.nationstates.net/images/cards/s3/${card.flag})`}` }}></div></div>
                                </div>
                                <div className="s3-topline">
                                    <div className="s3-topbox">
                                        <div className="s3-slogan">
                                            {card.motto}
                                        </div>
                                    </div>
                                </div>
                                <div className="deckcard-name">
                                    <p className="nlink nameblock"><span className="nnameblock"><span className="ntype">
                                        The {card.type} of</span> <span className="nname">{card.name}</span></span></p>
                                </div>
                            </div>
                            <div className="s3-mid deckcard-badges">
                                {opt && <p className="text-[0.5rem] p-1 text-black shadow-md">{opt}</p>}
                                <div className="role-badges">
                                    {Object.keys(card.badges).map(badge => {
                                        if (banners[badge]) {
                                            let badge_img = banners[badge]
                                            return (
                                                <div key={badge} className="badge">
                                                    <div className={badge_img}><i className="icon-flash"></i>{badge}</div>
                                                </div>
                                            )
                                        }
                                    }
                                    )}
                                </div>
                                <div className="trophies">
                                    <Badges cardBadges={card.badges as {[key: string]: string}} cardTrophies={Object.keys(card.trophies)} />
                                </div>
                            </div>
                            <div className="s3-lower">
                                <div className="deckcard-lower-collection deckcard-govt-collection">
                                    {card.description && <S2S3Description description={card.description} />}
                                </div>
                                <div className="deckcard-lower-collection">
                                    <div className="deckcard-category"></div>
                                    <div className="deckcard-govt">
                                        {card.category}
                                    </div>
                                </div>
                                <div className="deckcard-stripe">
                                    <div className="deckcard-season">SEASON THREE</div>
                                    <div className="deckcard-region"><p className="rlink">{card.region}</p></div>
                                </div>
                            </div>
                        </div>
                    </figure>
                </div>
            </div>
        </a>
    )
}