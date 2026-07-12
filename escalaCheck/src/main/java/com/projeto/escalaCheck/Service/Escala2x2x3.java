package com.projeto.escalaCheck.Service;

import com.projeto.escalaCheck.Model.StatusDia;
import com.projeto.escalaCheck.Model.TipoEscala;

import java.time.LocalDate;
import java.time.temporal.ChronoUnit;

public class Escala2x2x3 implements CalculadorEscala{

    private static final StatusDia[] CICLO = {
            StatusDia.TRABALHO, StatusDia.TRABALHO,
            StatusDia.FOLGA, StatusDia.FOLGA,
            StatusDia.TRABALHO, StatusDia.TRABALHO, StatusDia.TRABALHO,
            StatusDia.FOLGA,StatusDia.FOLGA,
            StatusDia.TRABALHO, StatusDia.TRABALHO,
            StatusDia.FOLGA, StatusDia.FOLGA, StatusDia.FOLGA
    };

    @Override
    public StatusDia calcular(LocalDate dataReferencia, LocalDate dataAlvo) {
        long diasPassados = ChronoUnit.DAYS.between(dataReferencia, dataAlvo);
        int posicaoNoCiclo = (int) (diasPassados % 14);

        if (posicaoNoCiclo < 0){
            posicaoNoCiclo += 14;
        }

        return CICLO[posicaoNoCiclo];
    }
}
