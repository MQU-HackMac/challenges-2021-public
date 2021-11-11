from flask import Flask, render_template, request, session, redirect, url_for, flash, get_flashed_messages
import sqlite3
import hashlib
import random

app = Flask(__name__)
app.secret_key = "this_is_a_really_big_secret"


def query(sql, values=()):
    error = ""
    rows = []
    try:
        conn = sqlite3.connect("warehouse.db")
        cur = conn.cursor()
        cur.execute(sql, values)
        conn.commit()
        rows = cur.fetchall()
        conn.close()
    except sqlite3.Error as e:
        error = True
        print(sql)
        print(e)
    return {"rows": rows, "error": error}


def check_login(username, password):
    sql = f"SELECT username FROM users WHERE username='{username}' AND password='{hashlib.md5(password.encode('utf-8')).hexdigest()}'"
    out = query(sql)

    # SQL Error on login
    if out["error"]:
        flash(f"error on check_login: {sql}")

    if len(out["rows"]) > 0:
        return True

    return False


def write_log(username, status, user_agent, ip):
    sql = f"INSERT INTO login_logs VALUES (?, ?, ?, ?)"
    out = query(sql, (username, status, user_agent, ip))

    if out["error"]:
        flash(f"error on write_log: {sql}")


def gen_ip():
    return f"{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}.{random.randint(1, 254)}"


@app.route("/")
def index():
    if "loggedin" not in session or not session["loggedin"]:
        return redirect(url_for("login"))

    return render_template("flag.html")


@app.route("/login", methods=["POST", "GET"])
def login():
    if request.method == "POST":
        username = request.form.get("username")
        password = request.form.get("password")
        if check_login(username, password):
            session["loggedin"] = True
            # write_log(username, "success", request.headers.get(
            #     "User-Agent"), gen_ip())
            return redirect(url_for("index"))
        else:
            session["loggedin"] = False
            # write_log(username, "failed", request.headers.get(
            #     "User-Agent"), gen_ip())
            error = "Login failed"
            if request.args.get("debug") == "1" and len(get_flashed_messages()) > 0:
                return render_template("db_debug.html", error=error), 500
            else:
                return render_template("login.html", error=error), 401

    return render_template("login.html")


if __name__ == "__main__":
    app.run(host="0.0.0.0", port=1337)
