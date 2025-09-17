from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from database import engine, Base
from models import alojamento, estadia, pessoa, user # Garante que os modelos sejam registados
from routers import alojamentos, auth, estadias, pessoas, users
from sqlalchemy.orm import sessionmaker
from passlib.context import CryptContext

# Cria tabelas no banco de dados (se não existirem)
Base.metadata.create_all(bind=engine)

# Seeding inicial de utilizadores
SessionLocal = sessionmaker(autocommit=False, autoflush=False, bind=engine)
db = SessionLocal()
if not db.query(user.User).first():
    pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")
    users_to_create = [
        user.User(username = "admin", password_hash = pwd_context.hash("senha123"), role = "Admin"),
        user.User(username = "Fabricio", password_hash = pwd_context.hash("fabricio123"), role = "User"),
        user.User(username = "Ursula", password_hash = pwd_context.hash("ursula123"), role = "User"),
        user.User(username = "Lucianda", password_hash = pwd_context.hash("lucianda123"), role = "User"),
        user.User(username = "Scalco", password_hash = pwd_context.hash("scalco123"), role = "User"),
        user.User(username = "Arthur", password_hash = pwd_context.hash("arthur123"), role = "User")
    ]
    db.add_all(users_to_create)
    db.commit()
    print("[INFO] Base de dados populada com utilizadores padrão.")
db.close()

app = FastAPI()

# Configuração do CORS
origins = [
    "https://front-production-3b60.up.railway.app",
    "http://localhost:3000", # Adicione para desenvolvimento local se necessário
]

app.add_middleware(
    CORSMiddleware,
    allow_origins=origins,
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Inclui os routers
app.include_router(alojamentos.router)
app.include_router(auth.router)
app.include_router(estadias.router)
app.include_router(pessoas.router)
app.include_router(users.router)

@app.get("/")
def read_root():
    return {"message": "Bem-vindo à Alojamentos API"}

# Para executar a aplicação:
# uvicorn main:app --reload