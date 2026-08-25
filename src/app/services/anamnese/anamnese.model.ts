export interface AnamneseDTO {

  id?: number;
  pacienteId: number;

  dataRegistro?: string;
  profissionalResponsavel?: string;

  queixaPrincipal?: string;
  historiaDoencaAtual?: string;
  encaminhamentos?: string;
  antecedentesFamiliares?: string;
  habitosDeVida?: string;
  observacoesGerais?: string;

  alergias?: string;
  cirurgias?: string;
  medicamentosUsados?: string;
  historicoDeInternacao?: string;
  observacoesGestacao?: string;

  localNascimento?: string;
  tipoParto?: string;
  posicaoNascimento?: string;

  chorouAoNascer?: boolean;
  nasceuVermelho?: boolean;
  nasceuRoxo?: boolean;
  anoxia?: boolean;
  ictericia?: boolean;
  precisouOxigenio?: boolean;
  incubadora?: boolean;

  altaHospitalar?: string;

  sorriu?: boolean;
  equilibrouPescoco?: boolean;
  engatinhou?: boolean;
  sentou?: boolean;
  andou?: boolean;
  primeirasPalavras?: string;
  falaCorreta?: boolean;
  trocouLetras?: boolean;
  gaguejou?: boolean;
  denticao?: boolean;

  controleEsfincterAnalDiurno?: string;
  controleEsfincterVesicalDiurno?: string;
  controleEsfincterNoturno?: string;

  cuidadosPorQuem?: string;

  usouChupeta?: boolean;
  chupouDedo?: boolean;
  roeUnhas?: boolean;
  puxaOrelha?: boolean;
  arrancaCabelos?: boolean;
  mordeLabios?: boolean;
  tiques?: boolean;

  atitudeDianteHabitos?: string;

  dormeBem?: boolean;
  pulaQuandoDorme?: boolean;
  babaNoite?: boolean;
  sudorese?: boolean;
  acordaVariasVezes?: boolean;
  falaDormindo?: boolean;
  gritaDormindo?: boolean;
  rangeDentes?: boolean;
  sonambulo?: boolean;
  pesadelos?: boolean;

  amamentadoNoPeito?: boolean;

  atitudeDesmame?: string;
  habitosAlimentares?: string;

  comportamentoEscola?: string;
  gostaEstudar?: boolean;
  historicoEscolar?: string;
  gostaEscola?: boolean;

  queixasComportamento?: string;
  dificuldadeAprendizagem?: boolean;

  prefereBrincar?: string;
  ativoOuPassivo?: string;

  observacoesComportamentoSocial?: string;

  observacoesEstrategicas?: string;

  projetoTerapeuticoSingular?: string;
}