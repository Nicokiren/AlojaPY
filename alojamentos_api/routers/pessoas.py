from fastapi import APIRouter, Depends, HTTPException
from sqlalchemy.orm import Session
from database import get_db
from models.pessoa import Pessoa
from pydantic import BaseModel

class PessoaSchema(BaseModel):
    id: int
    nome: str
    cpf: str
    cargo: str | None = None
    telefone: str | None = None
    class Config:
        orm_mode = True

class PessoaCreate(BaseModel):
    nome: str
    cpf: str
    cargo: str | None = None
    telefone: str | None = None

router = APIRouter(
    prefix="/api/pessoas",
    tags=["pessoas"]
)

@router.get("/", response_model=list[PessoaSchema])
def get_pessoas(db: Session = Depends(get_db)):
    return db.query(Pessoa).all()

@router.get("/{pessoa_id}", response_model=PessoaSchema)
def get_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    pessoa = db.query(Pessoa).filter(Pessoa.id == pessoa_id).first()
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada.")
    return pessoa

@router.post("/", response_model=PessoaSchema)
def create_pessoa(pessoa: PessoaCreate, db: Session = Depends(get_db)):
    db_pessoa = db.query(Pessoa).filter(Pessoa.cpf == pessoa.cpf).first()
    if db_pessoa:
        raise HTTPException(status_code=409, detail="Já existe uma pessoa cadastrada com este CPF.")
    new_pessoa = Pessoa(**pessoa.dict())
    db.add(new_pessoa)
    db.commit()
    db.refresh(new_pessoa)
    return new_pessoa

@router.put("/{pessoa_id}")
def update_pessoa(pessoa_id: int, pessoa_data: PessoaCreate, db: Session = Depends(get_db)):
    db_pessoa = db.query(Pessoa).filter(Pessoa.id == pessoa_id).first()
    if not db_pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada.")
    
    db_pessoa.nome = pessoa_data.nome
    db_pessoa.cpf = pessoa_data.cpf
    db_pessoa.cargo = pessoa_data.cargo
    db_pessoa.telefone = pessoa_data.telefone
    
    db.commit()
    return {"message": "Pessoa atualizada com sucesso."}

@router.delete("/{pessoa_id}")
def delete_pessoa(pessoa_id: int, db: Session = Depends(get_db)):
    pessoa = db.query(Pessoa).filter(Pessoa.id == pessoa_id).first()
    if not pessoa:
        raise HTTPException(status_code=404, detail="Pessoa não encontrada.")
    db.delete(pessoa)
    db.commit()
    return {"message": "Pessoa deletada com sucesso."}