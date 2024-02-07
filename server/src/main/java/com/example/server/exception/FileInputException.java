package com.example.server.exception;

import java.io.IOException;

public class FileInputException extends IOException {
    public FileInputException(String message) {
        super(message);
    }
}
