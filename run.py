from flask import Flask
from routes import bp as routes_bp
from models import db, Funcionario

def create_app():
    app = Flask(__name__)
    app.config['SECRET_KEY'] = '123456'  # Adicione esta linha
    app.config['SQLALCHEMY_DATABASE_URI'] = 'sqlite:///meubanco.db'
    app.config['SQLALCHEMY_TRACK_MODIFICATIONS'] = False

    db.init_app(app)
    app.register_blueprint(routes_bp)

    return app

if __name__ == '__main__':
    app = create_app()
    with app.app_context():
        db.create_all()
        # Criação de usuário admin
        admin = Funcionario(nome='admin', cargo='Administrador')
        admin.set_password('admin123')
        db.session.add(admin)
        db.session.commit()
    app.run(debug=True)