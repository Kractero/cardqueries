from sqlalchemy import Column, Integer, String, Text
from sqlalchemy.dialects.postgresql import JSONB
from database import Base

class Card(Base):
    __tablename__ = 'cards'

    id = Column(Integer, primary_key=True, index=True)
    season = Column(Integer, primary_key=True)
    name = Column(String(255))
    type = Column(String(255))
    motto = Column(String(255))
    category = Column(String(255))
    region = Column(String(255))
    flag = Column(String(255))
    cardcategory = Column(String(255))
    description = Column(Text)
    badges = Column(JSONB)
    trophies = Column(JSONB)
