from sqlalchemy import create_engine, desc
from sqlalchemy.orm import sessionmaker
from models import Base, McData

DATABASE_URI = 'mysql+pymysql://root:qwe1597532468ewq@localhost:3306/mcDB'

engine = create_engine(DATABASE_URI)
Session = sessionmaker(bind=engine)
Base.metadata.create_all(engine)

def insert_data(mcAddress, humidity, temperature, isFire):
    session = Session()
    try:
        new_data = McData(mcAddress=mcAddress, humidity=humidity, temperature=temperature, isFire=isFire)
        session.add(new_data)
        session.commit()
    except Exception as e:
        session.rollback()
        print(f"Error inserting data: {e}")
    finally:
        session.close()

def read_last_10_records():
    session = Session()
    try:
        data = session.query(McData).order_by(desc(McData.id)).limit(10).all()
        return [row.to_dict() for row in data]
    except Exception as e:
        print(f"Error reading data: {e}")
        return []
    finally:
        session.close()

def read_mc_data_with_id(minId):
    session = Session()
    try:
        data = session.query(McData).filter(McData.id < minId).order_by(desc(McData.id)).limit(10).all()
        return [row.to_dict() for row in data]
    except Exception as e:
        print(f"Error reading data: {e}")
        return []
    finally:
        session.close()

def read_mc_data_with_id_more(maxId):
    session = Session()
    try:
        data = session.query(McData).filter(McData.id >= maxId, McData.id < maxId + 10).order_by(desc(McData.id)).all()
        return [row.to_dict() for row in data]
    except Exception as e:
        print(f"Error reading data: {e}")
        return []
    finally:
        session.close()


def read_last_100_record():
    session = Session()
    try:
        data = session.query(McData.timeStamp, McData.temperature, McData.humidity).order_by(desc(McData.id)).limit(100).all()
        return [{'timeStamp': row.timeStamp.strftime("%Y-%m-%d %H:%M:%S"), 'temperature': row.temperature, 'humidity': row.humidity} for row in data]
    except Exception as e:
        print(f"Error reading data: {e}")
        return []
    finally:
        session.close()