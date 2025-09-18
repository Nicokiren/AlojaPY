# alojamentos_api/routers/relatorios.py
from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session
from database import get_db
from models.estadia import Estadia
from datetime import datetime, timedelta

router = APIRouter(
    prefix="/api/relatorios",
    tags=["relatorios"]
)

@router.get("/ocupacao")
def get_relatorio_ocupacao(db: Session = Depends(get_db)):
    # Por enquanto, vamos retornar todas as estadias
    # No futuro, adicionaremos filtros de data aqui
    estadias = db.query(Estadia).all()
    return estadias