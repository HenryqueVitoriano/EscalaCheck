package com.projeto.escalaCheck.Controller;

import com.projeto.escalaCheck.Model.TipoEscala;
import com.projeto.escalaCheck.Service.EscalasService;
import org.springframework.beans.factory.annotation.Autowired;
import org.springframework.web.bind.annotation.*;

import java.time.LocalDate;

@RestController
@RequestMapping("/escalas")
public class EscalaController {

    @Autowired
    private EscalasService escalaService;

    @GetMapping(path = "/verificar")
    public String calcularEscalas(@RequestParam TipoEscala tipoEscala, @RequestParam LocalDate dataReferencia, LocalDate dataAlvo){
        return escalaService.verificarEscala(tipoEscala, dataReferencia, dataAlvo).toString();
    }
}
