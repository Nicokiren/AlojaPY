from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.pessoa import Pessoa
from pydantic import BaseModel
from typing import List, Optional

# Schemas (moldes) para validação de dados
# Corrigido para usar 'lotacao' e estar em conformidade com o modelo do banco de dados
class PessoaSchema(BaseModel):
    id: int
    nome: str
    cpf: str
    lotacao: Optional[str] = None
    telefone: Optional[str] = None

    class Config:
        from_attributes = True

class PessoaCreate(BaseModel):
    nome: str
    cpf: str
    lotacao: Optional[str] = None
    telefone: Optional[str] = None

router = APIRouter(
    prefix="/api/pessoas",
    tags=["pessoas"]
)

# CORREÇÃO: Adicionada a rota sem a barra para evitar o redirecionamento
@router.get("", include_in_schema=False, response_model=List[PessoaSchema])
@router.get("/", response_model=List[PessoaSchema])
def get_pessoas(db: Session = Depends(get_db)):
    """
    Retorna uma lista de todas as pessoas cadastradas.
    """
    return db.query(Pessoa).all()

@router.get("/{pessoa_id}", response_model=PessoaSchema)
def get_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    """
    Retorna os detalhes de uma pessoa específica pelo seu ID.
    """
    pessoa = db.query(Pessoa).filter(Pessoa.id == pessoa_id).first()
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada.")
    return pessoa

@router.post("/", response_model=PessoaSchema, status_code=201)
def create_pessoa(pessoa: PessoaCreate, db: Session = Depends(get_db)):
    """
    Cria uma nova pessoa no sistema.
    """
    db_pessoa = db.query(Pessoa).filter(Pessoa.cpf == pessoa.cpf).first()
    if db_pessoa:
        raise HTTPException(status_code=409, detail="Já existe uma pessoa cadastrada com este CPF.")
    
    # O objeto é criado usando os nomes corretos
    new_pessoa = Pessoa(**pessoa.dict())
    db.add(new_pessoa)
    db.commit()
    db.refresh(new_pessoa)
    return new_pessoa

@router.put("/{pessoa_id}", response_model=PessoaSchema)
def update_pessoa(pessoa_id: int, pessoa_data: PessoaCreate, db: Session = Depends(get_db)):
    """
    Atualiza os dados de uma pessoa existente.
    """
    db_pessoa = db.query(Pessoa).filter(Pessoa.id == pessoa_id).first()
    if not db_pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada.")
    
    db_pessoa.nome = pessoa_data.nome
    db_pessoa.cpf = pessoa_data.cpf
    db_pessoa.lotacao = pessoa_data.lotacao
    db_pessoa.telefone = pessoa_data.telefone
    
    db.commit()
    db.refresh(db_pessoa)
    return db_pessoa

@router.delete("/{pessoa_id}", status_code=204)
def delete_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    """
    Remove uma pessoa do sistema.
    """
    pessoa = db.query(Pessoa).filter(Pessoa.id == pessoa_id).first()
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada.")
    
    db.delete(pessoa)
    db.commit()
    return {"ok": True}