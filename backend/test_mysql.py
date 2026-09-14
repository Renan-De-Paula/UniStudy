import pymysql

try:
    connection = pymysql.connect(host='127.0.0.1', user='root', password='root')
    print("Connected successfully!")
    with connection.cursor() as cursor:
        cursor.execute("CREATE DATABASE IF NOT EXISTS unistudy_db;")
    connection.commit()
    print("Database unistudy_db created/verified.")
except Exception as e:
    print(f"Error: {e}")
