from flask import Blueprint, render_template, request, redirect, url_for, session
from models import db, Funcionario

bp = Blueprint('routes', __name__)

@bp.route('/')
def index():
    return render_template('index.html')

@bp.route('/login', methods=['GET', 'POST'])
def login():
    error = None
    if request.method == 'POST':
        username = request.form['username']
        password = request.form['password']
        user = Funcionario.query.filter_by(nome=username).first()
        if user and user.check_password(password):
            session['user_id'] = user.id
            return redirect(url_for('routes.dashboard'))  # alterado para dashboard
        else:
            error = 'Usuário ou senha inválidos'
    return render_template('login.html', error=error)

@bp.route('/dashboard')
def dashboard():
    if 'user_id' not in session:
        return redirect(url_for('routes.login'))
    return render_template('dashboard.html')

@bp.route('/ponto')
def ponto():
    if 'user_id' not in session:
        return redirect(url_for('routes.login'))
    return render_template('ponto.html')

@bp.route('/justificativas')
def justificativas():
    if 'user_id' not in session:
        return redirect(url_for('routes.login'))
    return render_template('justificativas.html')

@bp.route('/relatorios')
def relatorios():
    if 'user_id' not in session:
        return redirect(url_for('routes.login'))
    return render_template('relatorios.html')