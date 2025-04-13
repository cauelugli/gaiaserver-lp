
import * as React from "react";

import Box from "@mui/material/Box";
import { Typography } from "@mui/material";

export const footerModalContents = {
  "Política de Privacidade": (
    <Box sx={{ maxHeight: "60vh", overflow: "auto", p: 1 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Política de Privacidade do GaiaServer ERP
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        1. Coleta de Informações
      </Typography>
      <Typography>
        O GaiaServer ERP coleta informações necessárias para o funcionamento do
        sistema, incluindo:
      </Typography>
      <ul>
        <li>
          <Typography>Dados cadastrais da empresa e usuários</Typography>
        </li>
        <li>
          <Typography>Informações financeiras e contábeis</Typography>
        </li>
        <li>
          <Typography>Dados de estoque e operações comerciais</Typography>
        </li>
        <li>
          <Typography>Registros de acesso ao sistema</Typography>
        </li>
      </ul>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        2. Uso dos Dados
      </Typography>
      <Typography>
        Utilizamos os dados coletados exclusivamente para:
      </Typography>
      <ul>
        <li>
          <Typography>Fornecer e melhorar nossos serviços de ERP</Typography>
        </li>
        <li>
          <Typography>Garantir a segurança e integridade do sistema</Typography>
        </li>
        <li>
          <Typography>Gerar relatórios e análises para o cliente</Typography>
        </li>
        <li>
          <Typography>Cumprir obrigações legais</Typography>
        </li>
      </ul>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        3. Compartilhamento
      </Typography>
      <Typography>Não compartilhamos dados com terceiros, exceto:</Typography>
      <ul>
        <li>
          <Typography>Quando exigido por lei</Typography>
        </li>
        <li>
          <Typography>
            Para processamento de pagamentos (com parceiros certificados)
          </Typography>
        </li>
        <li>
          <Typography>Com seu consentimento explícito</Typography>
        </li>
      </ul>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        4. Segurança
      </Typography>
      <Typography>
        Implementamos medidas de segurança robustas, incluindo:
      </Typography>
      <ul>
        <li>
          <Typography>
            Criptografia de dados em trânsito e em repouso
          </Typography>
        </li>
        <li>
          <Typography>Controle de acesso baseado em permissões</Typography>
        </li>
        <li>
          <Typography>Backups regulares</Typography>
        </li>
        <li>
          <Typography>Monitoramento contínuo</Typography>
        </li>
      </ul>

      <Typography variant="body2" sx={{ mt: 3, fontStyle: "italic" }}>
        Última atualização: {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  ),
  "Termos de Serviço": (
    <Box sx={{ maxHeight: "60vh", overflow: "auto", p: 1 }}>
      <Typography variant="h5" gutterBottom sx={{ fontWeight: "bold" }}>
        Termos de Serviço do GaiaServer ERP
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        1. Aceitação dos Termos
      </Typography>
      <Typography>
        Ao utilizar o GaiaServer ERP, você concorda com estes termos e com nossa
        Política de Privacidade.
      </Typography>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        2. Licença de Uso
      </Typography>
      <Typography>
        Concedemos uma licença limitada, não exclusiva e intransferível para:
      </Typography>
      <ul>
        <li>
          <Typography>Acessar e usar o ERP conforme documentação</Typography>
        </li>
        <li>
          <Typography>
            Configurar conforme necessidades do seu negócio
          </Typography>
        </li>
        <li>
          <Typography>Gerar relatórios e análises comerciais</Typography>
        </li>
      </ul>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        3. Responsabilidades do Usuário
      </Typography>
      <Typography>Você concorda em:</Typography>
      <ul>
        <li>
          <Typography>Fornecer informações precisas e atualizadas</Typography>
        </li>
        <li>
          <Typography>Manter suas credenciais de acesso seguras</Typography>
        </li>
        <li>
          <Typography>Utilizar o sistema apenas para fins legais</Typography>
        </li>
        <li>
          <Typography>Realizar backups periódicos de seus dados</Typography>
        </li>
      </ul>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        4. Limitações
      </Typography>
      <Typography>O GaiaServer ERP não se responsabiliza por:</Typography>
      <ul>
        <li>
          <Typography>
            Decisões tomadas com base nas informações do sistema
          </Typography>
        </li>
        <li>
          <Typography>Problemas decorrentes de uso inadequado</Typography>
        </li>
        <li>
          <Typography>Interrupções causadas por fatores externos</Typography>
        </li>
      </ul>

      <Typography
        variant="subtitle1"
        gutterBottom
        sx={{ mt: 3, fontWeight: "bold" }}
      >
        5. Modificações
      </Typography>
      <Typography>
        Reservamo-nos o direito de modificar estes termos a qualquer momento.
        Alterações significativas serão comunicadas com antecedência.
      </Typography>

      <Typography variant="body2" sx={{ mt: 3, fontStyle: "italic" }}>
        Vigência: a partir de {new Date().toLocaleDateString()}
      </Typography>
    </Box>
  ),
};
