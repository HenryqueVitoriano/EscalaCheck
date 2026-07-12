package com.projeto.escalaCheck.View;

import org.springframework.stereotype.Controller;
import org.springframework.web.bind.annotation.GetMapping;

@Controller
public class ViewController {
    @GetMapping("/")
    public String abrirIndex() {
        return "index";
    }
}
