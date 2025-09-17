from sqlalchemy import Column, Integer, DateTime, ForeignKey
from sqlalchemy.orm import relationship
from database import Base
import datetime

class Estadia(Base):
    __tablename__ = "estadias"

    id = Column(Integer, primary_key=True, index=True)
    pessoa_id = Column(Integer, ForeignKey("pessoas.id"), nullable=False)
    alojamento_id = Column(Integer, ForeignKey("alojamentos.id"), nullable=False)
    data_entrada = Column(DateTime, nullable=False, default=datetime.datetime.utcnow)
    data_saida = Column(DateTime, nullable=True)

    pessoa = relationship("Pessoa", back_populates="estadias")
    alojamento = relationship("Alojamento", back_populates="estadias")