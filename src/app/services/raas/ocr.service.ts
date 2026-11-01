import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { OcrProcessamentoStatus, OcrResultMessage, RaasOcrUploadResponse } from './ocr.model';
import { RaasAceitarDTO, RaasResponseDTO } from './raas.model';
import { environment } from '../../../environments/environment';

@Injectable({ providedIn: 'root' })
export class OcrService {

  private readonly apiUrl = `${environment.apiUrl}/api/raas/ocr`;

  constructor(private http: HttpClient) {}

  upload(file: File, pacienteId?: number): Observable<RaasOcrUploadResponse> {
    const formData = new FormData();
    formData.append('file', file);
    if (pacienteId) {
      formData.append('pacienteId', String(pacienteId));
    }
    return this.http.post<RaasOcrUploadResponse>(`${this.apiUrl}/upload`, formData);
  }

  status(correlationId: string): Observable<OcrProcessamentoStatus> {
    return this.http.get<OcrProcessamentoStatus>(`${this.apiUrl}/status/${correlationId}`);
  }

  resultado(correlationId: string): Observable<OcrResultMessage> {
    return this.http.get<OcrResultMessage>(`${this.apiUrl}/resultado/${correlationId}`);
  }

  aceitar(payload: RaasAceitarDTO): Observable<RaasResponseDTO> {
    return this.http.post<RaasResponseDTO>(`${this.apiUrl}/aceitar`, payload);
  }
}
