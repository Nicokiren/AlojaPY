from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.alojamento import Alojamento

router = APIRouter(
    prefix="/api/alojamentos",
    tags=["alojamentos"]
)

@router.get("/")
def get_alojamentos(db: Session = Depends(get_db)):
    return db.query(Alojamento).options(joinedload(Alojamento.estadias).joinedload("pessoa")).all()

@router.get("/{alojamento_id}")
def get_alojamento(alojamento_id: int, db: Session = Depends(get_db)):
    alojamento = db.query(Alojamento).options(joinedload(Alojamento.estadias).joinedload("pessoa")).filter(Alojamento.id == alojamento_id).first()
    if not alojamento:
        raise HTTPException(status_code=404, detail="Alojamento não encontrado.")
    return alojamento