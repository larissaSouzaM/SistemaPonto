from flask import Blueprint, request, jsonify

bp = Blueprint('routes', __name__)

@bp.route('/login', methods=['POST'])
def login():
    data = request.get_json()
    username = data.get('username')
    password = data.get('password')

    # Aqui você faria a validação do usuário no banco de dados
    if username == 'admin' and password == 'admin':
        return jsonify({'message': 'Login realizado com sucesso!'}), 200
    else:
        return jsonify({'message': 'Credenciais inválidas!'}), 401