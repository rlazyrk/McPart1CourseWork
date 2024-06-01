from sqlalchemy import Column, Integer, String, Float, Boolean, DateTime
from sqlalchemy.ext.declarative import declarative_base
from datetime import datetime

Base = declarative_base()

class McData(Base):
    __tablename__ = 'mcData'
    id = Column(Integer, primary_key=True)
    mcAddress = Column(String(255))
    humidity = Column(Float)
    temperature = Column(Float)
    isFire = Column(Boolean)
    timeStamp = Column(DateTime, default=datetime.utcnow)

    def to_dict(self):
        return {
            'id': self.id,
            'mcAddress': self.mcAddress,
            'humidity': self.humidity,
            'temperature': self.temperature,
            'isFire': self.isFire,
            'timeStamp': self.timeStamp.strftime("%Y-%m-%d %H:%M:%S")
        }