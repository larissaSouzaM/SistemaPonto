from flask_sqlalchemy import SQLAlchemy

db = SQLAlchemy()

class Funcionario(db.Model):
    __tablename__ = 'funcionarios'
    id = db.Column(db.Integer, primary_key=True)
    nome = db.Column(db.String(100), nullable=False)
    cargo = db.Column(db.String(50), nullable=False)
    senha = db.Column(db.String(128), nullable=False)  # Armazene o hash da senha

    def __repr__(self):
        return f'<Funcionario {self.nome}>'