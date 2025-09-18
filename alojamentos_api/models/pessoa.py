from sqlalchemy import Column, Integer, String
from sqlalchemy.orm import relationship
from database import Base

class Pessoa(Base):
    __tablename__ = "pessoas"

    id = Column(Integer, primary_key=True, index=True)
    nome = Column(String(100), nullable=False)
    cpf = Column(String(14), unique=True, index=True, nullable=False)
    lotacao = Column(String(100), nullable=True) # Corrigido de 'cargo'
    telefone = Column(String(20), nullable=True)

    estadias = relationship("Estadia", back_populates="pessoa")