import mysql.connector


conexao_BD= {
    "host": "localhost",
    "user": "root",
    "password": "aluno",
    "database": "estudamais"
}
conn = mysql.connector.connect(**conexao_BD)
cursor = conn.cursor(dictionary=True)
cursor.execute("SELECT * FROM materias")
materias = cursor.fetchall()
cursor.close()
conn.close()