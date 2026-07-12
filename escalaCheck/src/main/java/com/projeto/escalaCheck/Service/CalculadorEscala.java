package com.projeto.escalaCheck.Service;

import com.projeto.escalaCheck.Model.StatusDia;
import com.projeto.escalaCheck.Model.TipoEscala;

import java.time.LocalDate;

public interface CalculadorEscala {
    StatusDia calcular(LocalDate dataReferencia, LocalDate dataAlvo);
}
