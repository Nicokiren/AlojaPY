from sqlalchemy import Column, Integer, String, Boolean
from sqlalchemy.orm import relationship
from database import Base

class Alojamento(Base):
    __tablename__ = "alojamentos"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    capacidade = Column(Integer, nullable=False)
    tem_ar_condicionado = Column(Boolean, default=False)

    estadias = relationship("Estadia", back_populates="alojamento")