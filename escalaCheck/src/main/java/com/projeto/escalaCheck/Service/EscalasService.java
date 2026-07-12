package com.projeto.escalaCheck.Service;


import com.projeto.escalaCheck.Model.StatusDia;
import com.projeto.escalaCheck.Model.TipoEscala;
import org.springframework.stereotype.Service;

import java.time.LocalDate;

@Service
public class EscalasService  {

    public StatusDia verificarEscala(TipoEscala tipoEscala, LocalDate dataReferencia, LocalDate dataAlvo){

        CalculadorEscala calculador = switch (tipoEscala){
            case ESCALA_2X2X3 -> new Escala2x2x3();
            case ESCALA_12_36 -> null;
            case ESCALA_2X2 -> new Escala2x2();
        };

        assert calculador != null;
        return calculador.calcular(dataReferencia, dataAlvo);
    }

}
