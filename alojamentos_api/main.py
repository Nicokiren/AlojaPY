from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base, SessionLocal
from models import alojamento, estadia, pessoa, user
from routers import alojamentos, auth, estadias, pessoas, users, relatorios
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Cria tabelas no banco de dados (se não existirem)
Base.metadata.create_all(bind=engine)

db = SessionLocal()

# --- SEEDING INICIAL DE DADOS ---
# Popula os utilizadores padrão se a tabela estiver vazia
if not db.query(user.User).first():
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    users_to_create = [
        user.User(username="admin", password_hash=pwd_context.hash("senha123"), role="Admin"),
        # ... outros usuários ...
    ]
    db.add_all(users_to_create)
    db.commit()
    print("[INFO] Base de dados populada com utilizadores padrão.")

# Popula os alojamentos com base na lista exata, se a tabela estiver vazia
if db.query(alojamento.Alojamento).count() == 0:
    print("[INFO] Populando a base de dados com a lista final de alojamentos...")
    
    # Lista de todos os quartos definidos por você
    quartos_a_criar = [
        # Femininos
        {"nome": "AS-1", "ar": False}, {"nome": "AS-2", "ar": False},
        {"nome": "AS-4", "ar": False}, {"nome": "AS-5", "ar": False},
        {"nome": "AS-6", "ar": False}, {"nome": "AS-7", "ar": True},
        {"nome": "AS-8", "ar": False}, {"nome": "AS-9", "ar": False},
        {"nome": "AS-11", "ar": False}, {"nome": "AS-12", "ar": False},
        {"nome": "AS-13", "ar": False}, {"nome": "AS-14", "ar": False},
        {"nome": "AS-17", "ar": True},
        # Masculinos Inferiores
        {"nome": "BI-1", "ar": False}, {"nome": "BI-2", "ar": False},
        {"nome": "BI-3", "ar": False}, {"nome": "BI-4", "ar": False},
        {"nome": "BI-5", "ar": False}, {"nome": "BI-6", "ar": False},
        {"nome": "BI-7", "ar": True}, {"nome": "BI-8", "ar": True},
        # Masculinos Superiores
        {"nome": "BS-09", "ar": False}, {"nome": "BS-10", "ar": False},
        {"nome": "BS-11", "ar": False}, {"nome": "BS-12", "ar": False},
        {"nome": "BS-14", "ar": False}, {"nome": "BS-15", "ar": False},
        {"nome": "BS-16", "ar": False}, {"nome": "BS-17", "ar": False},
        {"nome": "BS-18", "ar": False}, {"nome": "BS-19", "ar": False},
        {"nome": "BS-20", "ar": True}, {"nome": "BS-21", "ar": True},
    ]

    novos_alojamentos = []
    for q in quartos_a_criar:
        novo_alojamento = alojamento.Alojamento(
            nome=q["nome"],
            capacidade=3, # Capacidade fixa em 3 para todos
            tem_ar_condicionado=q["ar"]
        )
        novos_alojamentos.append(novo_alojamento)
        
    db.add_all(novos_alojamentos)
    db.commit()
    print(f"[INFO] {len(novos_alojamentos)} alojamentos foram criados com sucesso.")

db.close()

app = FastAPI()

# Configuração do CORS (já corrigida)
origins = [ "http://localhost:5173", "http://127.0.0.1:5173", ]
app.add_middleware(CORSMiddleware, allow_origins=origins, allow_credentials=True, allow_methods=["*"], allow_headers=["*"])

# Inclusão dos routers (já corrigida)
app.include_router(alojamentos.router)
app.include_router(auth.router)
app.include_router(estadias.router)
app.include_router(pessoas.router)
app.include_router(users.router)
app.include_router(relatorios.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à Alojamentos API"}