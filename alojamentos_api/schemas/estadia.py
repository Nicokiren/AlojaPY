from pydantic import BaseModel
from typing import Optional
import datetime

class EstadiaBase(BaseModel):
    pessoa_id: int
    alojamento_id: int

class EstadiaCreate(EstadiaBase):
    pass

class MudarAlojamento(BaseModel):
    pessoa_id: int
    novo_alojamento_id: int

class EstadiaUpdate(BaseModel):
    data_entrada: Optional[datetime.datetime] = None
    data_saida: Optional[datetime.datetime] = None
    limpar_data_saida: bool = False

class Estadia(EstadiaBase):
    id: int
    data_entrada: datetime.datetime
    data_saida: Optional[datetime.datetime] = None

    class Config:
        orm_mode = True