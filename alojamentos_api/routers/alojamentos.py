from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session, joinedload
from database import get_db
from models.alojamento import Alojamento
from typing import List
from pydantic import BaseModel # <-- AQUI ESTÁ A CORREÇÃO

# Schema para garantir que a resposta tenha o formato correto
# (Isso também ajuda a documentação da API a ser mais clara)
class AlojamentoSchema(BaseModel):
    id: int
    nome: str
    capacidade: int
    tem_ar_condicionado: bool
    
    class Config:
        from_attributes = True

router = APIRouter(
    prefix="/api/alojamentos",
    tags=["alojamentos"]
)

# Rota corrigida para evitar o redirecionamento (erro de CORS)
@router.get("", include_in_schema=False)
@router.get("/", response_model=List[AlojamentoSchema])
def get_alojamentos(db: Session = Depends(get_db)):
    """
    Retorna uma lista de todos os alojamentos.
    """
    # Usamos joinedload para buscar as estadias e pessoas de uma só vez, o que é mais eficiente.
    return db.query(Alojamento).options(
        joinedload(Alojamento.estadias).joinedload("pessoa")
    ).order_by(Alojamento.nome).all()

@router.get("/{alojamento_id}")
def get_alojamento(alojamento_id: int, db: Session = Depends(get_db)):
    """
    Retorna os detalhes de um alojamento específico.
    """
    alojamento = db.query(Alojamento).options(
        joinedload(Alojamento.estadias).joinedload("pessoa")
    ).filter(Alojamento.id == alojamento_id).first()
    
    if not alojamento:
        raise HTTPException(status_code=404, detail="Alojamento não encontrado.")
        
    return alojamento