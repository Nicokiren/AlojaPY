from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import estadia, alojamento, pessoa
from schemas.estadia import EstadiaCreate, MudarAlojamento, EstadiaUpdate  # Assumindo que você tem schemas
import datetime

router = APIRouter(
    prefix="/api/estadias",
    tags=["estadias"]
)

# Rota de Check-in ATUALIZADA
@router.post("/checkin")
def check_in(estadia_data: EstadiaCreate, db: Session = Depends(get_db)):
    aloj = db.query(alojamento.Alojamento).filter(alojamento.Alojamento.id == estadia_data.alojamento_id).first()
    if not aloj:
        raise HTTPException(status_code=404, detail="Alojamento não encontrado.")
    
    # Verifica vagas considerando checkouts futuros
    estadias_ativas_no_alojamento = db.query(estadia.Estadia).filter(
        estadia.Estadia.alojamento_id == estadia_data.alojamento_id,
        (estadia.Estadia.data_saida == None) | (estadia.Estadia.data_saida >= datetime.datetime.utcnow())
    ).count()

    if estadias_ativas_no_alojamento >= aloj.capacidade:
        raise HTTPException(status_code=400, detail="O alojamento já atingiu sua capacidade máxima.")

    pessoa_ja_hospedada = db.query(estadia.Estadia).filter(
        estadia.Estadia.pessoa_id == estadia_data.pessoa_id,
        (estadia.Estadia.data_saida == None) | (estadia.Estadia.data_saida >= datetime.datetime.utcnow())
    ).first()
    if pessoa_ja_hospedada:
        raise HTTPException(status_code=400, detail="Esta pessoa já está em um alojamento ativo.")
        
    nova_estadia = estadia.Estadia(
        pessoa_id=estadia_data.pessoa_id,
        alojamento_id=estadia_data.alojamento_id,
        data_entrada=datetime.datetime.utcnow(),
        data_saida=estadia_data.data_saida # Novo campo vindo do frontend
    )
    db.add(nova_estadia)
    db.commit()
    db.refresh(nova_estadia)
    return nova_estadia

# Rota para ATUALIZAR as datas de uma estadia
@router.put("/{estadia_id}/datas")
def update_datas_estadia(estadia_id: int, request: EstadiaUpdate, db: Session = Depends(get_db)):
    est = db.query(estadia.Estadia).filter(estadia.Estadia.id == estadia_id).first()
    if not est:
        raise HTTPException(status_code=404, detail="Estadia não encontrada.")
    
    est.data_entrada = request.data_entrada
    est.data_saida = request.data_saida
    db.commit()
    return {"message": "Datas da estadia atualizadas com sucesso."}


# Outras rotas (checkout, mudar) permanecem aqui...
@router.put("/{id}/checkout")
def check_out(id: int, db: Session = Depends(get_db)):
    estadia_obj = db.query(estadia.Estadia).filter(estadia.Estadia.id == id).first()
    if not estadia_obj:
        return HTTPException(status_code=404, detail="Estadia não encontrada.")
    estadia_obj.data_saida = datetime.datetime.utcnow()
    db.commit()
    return {"message": "Checkout manual realizado com sucesso."}