from fastapi import APIRouter, Depends
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.alojamento import Alojamento

router = APIRouter(
    prefix="/api/alojamentos",
    tags=["alojamentos"]
)

# A CORREÇÃO ESTÁ AQUI:
# Adicionamos a rota sem a barra e dizemos ao FastAPI para não redirecionar.
@router.get("", include_in_schema=False)
@router.get("/")
def get_alojamentos(db: Session = Depends(get_db)):
    # Usamos joinedload para buscar as estadias e pessoas de uma só vez,
    # o que é mais eficiente.
    return db.query(Alojamento).options(
        joinedload(Alojamento.estadias).joinedload("pessoa")
    ).order_by(Alojamento.nome).all()

@router.get("/{alojamento_id}")
def get_alojamento(alojamento_id: int, db: Session = Depends(get_db)):
    alojamento = db.query(Alojamento).options(
        joinedload(Alojamento.estadias).joinedload("pessoa")
    ).filter(Alojamento.id == alojamento_id).first()
    
    if not alojamento:
        raise HTTPException(status_code=404, detail="Alojamento não encontrado.")
        
    return alojamento