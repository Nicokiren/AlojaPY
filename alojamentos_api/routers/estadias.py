from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models import estadia, alojamento, pessoa
from schemas.estadia import EstadiaCreate, MudarAlojamento, EstadiaUpdate
import datetime

router = APIRouter(
    prefix="/api/estadias",
    tags=["estadias"]
)

@router.post("/checkin")
def check_in(estadia_data: EstadiaCreate, db: Session = Depends(get_db)):
    aloj = db.query(alojamento.Alojamento).filter(alojamento.Alojamento.id == estadia_data.alojamento_id).first()
    if not aloj:
        raise HTTPException(status_code=404, detail="Alojamento não encontrado.")
    
    if not db.query(pessoa.Pessoa).filter(pessoa.Pessoa.id == estadia_data.pessoa_id).first():
        raise HTTPException(status_code=404, detail="Pessoa não encontrada.")

    estadias_ativas_no_alojamento = db.query(estadia.Estadia).filter(estadia.Estadia.alojamento_id == estadia_data.alojamento_id, estadia.Estadia.data_saida == None).count()
    if estadias_ativas_no_alojamento >= aloj.capacidade:
        raise HTTPException(status_code=400, detail="O alojamento já atingiu sua capacidade máxima.")

    pessoa_ja_hospedada = db.query(estadia.Estadia).filter(estadia.Estadia.pessoa_id == estadia_data.pessoa_id, estadia.Estadia.data_saida == None).first()
    if pessoa_ja_hospedada:
        raise HTTPException(status_code=400, detail="Esta pessoa já está em um alojamento.")
        
    nova_estadia = estadia.Estadia(
        pessoa_id=estadia_data.pessoa_id,
        alojamento_id=estadia_data.alojamento_id,
        data_entrada=datetime.datetime.utcnow(),
        data_saida=None
    )
    db.add(nova_estadia)
    db.commit()
    db.refresh(nova_estadia)
    return nova_estadia

@router.put("/{estadia_id}/checkout")
def check_out(estadia_id: int, db: Session = Depends(get_db)):
    est = db.query(estadia.Estadia).filter(estadia.Estadia.id == estadia_id, estadia.Estadia.data_saida == None).first()
    if not est:
        raise HTTPException(status_code=404, detail="Estadia ativa não encontrada para este ID.")
    est.data_saida = datetime.datetime.utcnow()
    db.commit()
    return {"message": "Checkout realizado com sucesso."}

@router.put("/mudar")
def mudar_alojamento(request: MudarAlojamento, db: Session = Depends(get_db)):
    estadia_atual = db.query(estadia.Estadia).filter(estadia.Estadia.pessoa_id == request.pessoa_id, estadia.Estadia.data_saida == None).first()
    if not estadia_atual:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada em nenhuma estadia ativa.")

    novo_aloj = db.query(alojamento.Alojamento).filter(alojamento.Alojamento.id == request.novo_alojamento_id).first()
    if not novo_aloj:
        raise HTTPException(status_code=404, detail="Novo alojamento não encontrado.")

    estadias_ativas_novo_aloj = db.query(estadia.Estadia).filter(estadia.Estadia.alojamento_id == request.novo_alojamento_id, estadia.Estadia.data_saida == None).count()
    if estadias_ativas_novo_aloj >= novo_aloj.capacidade:
        raise HTTPException(status_code=400, detail="O novo alojamento já atingiu sua capacidade máxima.")
        
    estadia_atual.data_saida = datetime.datetime.utcnow()

    nova_estadia = estadia.Estadia(
        pessoa_id=request.pessoa_id,
        alojamento_id=request.novo_alojamento_id,
        data_entrada=datetime.datetime.utcnow(),
        data_saida=None
    )
    db.add(nova_estadia)
    db.commit()
    db.refresh(nova_estadia)
    return nova_estadia

@router.put("/{estadia_id}")
def update_estadia(estadia_id: int, request: EstadiaUpdate, db: Session = Depends(get_db)):
    est = db.query(estadia.Estadia).filter(estadia.Estadia.id == estadia_id).first()
    if not est:
        raise HTTPException(status_code=404, detail="Estadia não encontrada.")
    if request.data_entrada:
        est.data_entrada = request.data_entrada
    if request.data_saida:
        est.data_saida = request.data_saida
    if request.limpar_data_saida:
        est.data_saida = None
    db.commit()
    return {"message": "Estadia atualizada com sucesso."}