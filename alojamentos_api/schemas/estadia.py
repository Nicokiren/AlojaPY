# schemas/estadia.py
from pydantic import BaseModel
from typing import Optional
import datetime

class EstadiaBase(BaseModel):
    pessoa_id: int
    alojamento_id: int

class EstadiaCreate(EstadiaBase):
    data_saida: Optional[datetime.datetime] = None # Campo para data de saída no check-in

class MudarAlojamento(BaseModel):
    pessoa_id: int
    novo_alojamento_id: int

class EstadiaUpdate(BaseModel):
    data_entrada: datetime.datetime
    data_saida: Optional[datetime.datetime] = None

class Estadia(EstadiaBase):
    id: int
    data_entrada: datetime.datetime
    data_saida: Optional[datetime.datetime] = None

    class Config:
        from_attributes = True