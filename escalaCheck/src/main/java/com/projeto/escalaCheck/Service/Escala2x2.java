package com.projeto.escalaCheck.Service;

import com.projeto.escalaCheck.Model.StatusDia;
import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Escala2x2 implements CalculadorEscala{

    private final StatusDia[] CICLO ={
            StatusDia.TRABALHO, StatusDia.TRABALHO,
            StatusDia.FOLGA, StatusDia.FOLGA,
    };


    @Override
    public StatusDia calcular(LocalDate dataReferencia, LocalDate dataAlvo) {
        long diasPassados = ChronoUnit.DAYS.between(dataReferencia, dataAlvo);
        int posicaoCiclo = (int) (diasPassados % 4);

        if (posicaoCiclo < 0){
            posicaoCiclo += 4;
        }
        return CICLO[posicaoCiclo];
    }
}
