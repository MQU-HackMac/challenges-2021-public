use sha2::{Digest, Sha256};
use std::env;
use std::io::{Read, Write};
use std::net::TcpStream;
use std::str::from_utf8;

fn generate_mac(message: &String, secret: &String, output: &mut [u8; 32]) {
    let secret_bytes = secret.as_bytes();
    let message_bytes = message.as_bytes();

    let full_message = [secret_bytes, message_bytes].concat();

    let digest = Sha256::digest(&full_message);

    output.copy_from_slice(&digest);
}

fn main() {
    let args: Vec<String> = env::args().collect();

    if args.len() < 5 {
        println!("Usage: ./vaccine_client host port secret command");
        return;
    }

    let host = &args[1];
    let port = &args[2];

    match TcpStream::connect(format!("{}:{}", host, port)) {
        Ok(mut stream) => {
            println!("Successfully connected to {}:{}\n", host, port);

            let secret = &args[3];
            let msg = &args[4];
            let len = msg.len().to_be_bytes();
            let mut mac = [0 as u8; 32];

            generate_mac(msg, secret, &mut mac);

            stream.write(&len[len.len() - 2..]).unwrap();
            stream.write(msg.as_bytes()).unwrap();
            stream.write(&mac).unwrap();

            let mut data = [0 as u8; 512];
            match stream.read(&mut data) {
                Ok(_) => {
                    print!("{}", from_utf8(&data).unwrap());
                }
                Err(e) => {
                    println!("Failed to receive data: {}", e);
                }
            }
        }
        Err(e) => {
            println!("Failed to connect to {}:{} : {}", host, port, e);
        }
    }
}
