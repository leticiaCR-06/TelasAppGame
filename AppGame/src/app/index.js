// index.js - telas do app de jogatinas em React Native (Expo Go).

// Não usei nenhuma lib de navegação, controlo a pilha de telas na mão com useState criando um histórico simples; 
// quando vou para uma tela, adiciono ela ao histórico, e quando volto, removo a última;
// fiz dessa forma porque o aplicativo tem poucas telas e eu queria manter a implementação mais simples. (254-261)

// Separei cada tela em um componente para evitar colocar toda a interface dentro do App;
// assim cada parte do aplicativo fica responsável por uma funcionalidade."

// Criei componentes reutilizáveis para elementos que aparecem mais de uma vez, como cards, cabeçalho e botão;
// se eu precisar alterar o estilo ou comportamento daquele elemento, posso fazer a alteração em um único lugar. (61-132)

import React, { useState } from 'react';
import { registerRootComponent } from 'expo';
import {
  SafeAreaView,
  ScrollView,
  View,
  Text,
  TextInput,
  TouchableOpacity,
  StyleSheet,
  Share,
  Linking,
} from 'react-native';

//como não tenho backend deixei tudo aqui em cima
//utilizei arrays de objetos para representar os dados, simulando as informações. 
const usuario = { nome: 'Letícia', inicial: 'L' };

const categorias = [
  { id: 'ranqueada', nome: 'Ranqueada', icone: '🏆' },
  { id: 'duelo', nome: 'Duelo 1x1', icone: '⚔️' },
  { id: 'diversao', nome: 'Diversão', icone: '😄' },
  { id: 'coop', nome: 'Cooperativo', icone: '🤝' },
];

const servidores = [
  { id: 1, nome: 'Lendários', jogo: 'League of Legends', cor: '#c89b3c' },
  { id: 2, nome: 'CSzin', jogo: 'Red Dead Redemption', cor: '#b3261e' },
  { id: 3, nome: 'Apex', jogo: 'Counter-Strike', cor: '#296dc0' },
  { id: 4, nome: 'Valorant', jogo: 'Dota 2', cor: '#4bc331' },
];

const jogadores = [
  { nome: 'Joaozinho', status: 'disponivel' },
  { nome: 'Lucca', status: 'ocupado' },
  { nome: 'Diego', status: 'ocupado' },
];

const partidasIniciais = [
  { id: 1, servidor: 1, categoria: 'ranqueada', data: '18/06', hora: '21:00', papel: 'anfitriao', descricao: 'É hoje que vamos chegar ao challenger sem perder uma partida da md10' },
  { id: 2, servidor: 2, categoria: 'diversao', data: '23/06', hora: '19:00', papel: 'visitante', descricao: 'Noite de faroeste, sem compromisso nenhum' },
  { id: 3, servidor: 3, categoria: 'duelo', data: '20/06', hora: '09:00', papel: 'anfitriao', descricao: 'Treino de mira antes do campeonato' },
  { id: 4, servidor: 4, categoria: 'coop', data: '25/06', hora: '20:00', papel: 'visitante', descricao: 'Partida decisiva para o acesso ao tier superior' },
];

const servidorPorId = (id) => servidores.find((s) => s.id === id);

// componentes que se repetem entre telas

function BotaoDiscord({ texto, onPress }) {
  return (
    <TouchableOpacity style={estilos.btnDiscord} onPress={onPress}>
      <View style={estilos.btnIcone}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>D</Text>
      </View>
      <View style={estilos.btnTexto}>
        <Text style={estilos.btnTextoTexto}>{texto}</Text>
      </View>
    </TouchableOpacity>
  );
}

function Cabecalho({ titulo, onVoltar, direita }) {
  return (
    <View style={estilos.cabecalho}>
      <TouchableOpacity onPress={onVoltar} style={estilos.btnTopo}>
        <Text style={estilos.setaVoltar}>‹</Text>
      </TouchableOpacity>
      <Text style={estilos.tituloCabecalho}>{titulo}</Text>
      <View style={estilos.btnTopo}>{direita}</View>
    </View>
  );
}

function CardCategoria({ categoria, ativa, onPress }) {
  return (
    <TouchableOpacity
      style={[estilos.categoria, ativa && estilos.categoriaAtiva]}
      onPress={onPress}
    >
      <Text style={{ fontSize: 26 }}>{categoria.icone}</Text>
      <Text style={estilos.categoriaTexto}>{categoria.nome}</Text>
      {ativa && <View style={estilos.bolinha} />}
    </TouchableOpacity>
  );
}

function CardPartida({ partida, onPress }) {
  const servidor = servidorPorId(partida.servidor);
  const categoria = categorias.find((c) => c.id === partida.categoria);
  const anfitriao = partida.papel === 'anfitriao';

  return (
    <TouchableOpacity style={estilos.partida} onPress={onPress}>
      <View style={[estilos.capa, { backgroundColor: servidor.cor }]}>
        <Text style={estilos.capaTexto}>{servidor.nome[0]}</Text>
      </View>
      <View style={{ flex: 1 }}>
        <View style={estilos.linha}>
          <Text style={estilos.nomeServidor}>{servidor.nome}</Text>
          <Text style={estilos.muted}>{categoria.nome}</Text>
        </View>
        <View style={[estilos.linha, { marginTop: 10 }]}>
          <Text style={{ color: '#e51c44', fontSize: 13 }}>
            {partida.data} às {partida.hora}h
          </Text>
          <Text style={{ color: anfitriao ? '#e51c44' : '#32bd7b', fontSize: 13 }}>
            {anfitriao ? 'Anfitrião' : 'Visitante'}
          </Text>
        </View>
      </View>
    </TouchableOpacity>
  );
}

function CardJogador({ jogador }) {
  const livre = jogador.status === 'disponivel';
  return (
    <View style={estilos.jogador}>
      <View style={estilos.avatar}>
        <Text style={{ color: '#fff', fontWeight: '700' }}>{jogador.nome[0]}</Text>
      </View>
      <View>
        <Text style={{ color: '#fff', fontSize: 16, fontWeight: '600' }}>{jogador.nome}</Text>
        <Text style={{ color: livre ? '#32bd7b' : '#e51c44', fontSize: 13 }}>
          {livre ? 'Disponível' : 'Ocupado'}
        </Text>
      </View>
    </View>
  );
}

// telas 

function TelaLogin({ trocarPara }) {
  return (
    <View style={[estilos.tela, { padding: 0, justifyContent: 'flex-end' }]}>
      <View style={estilos.loginImagem}>
        <Text style={{ fontSize: 70 }}>🎮</Text>
      </View>
      <View style={{ padding: 24, paddingBottom: 40 }}>
        <Text style={estilos.tituloLogin}>Conecte-se{'\n'}e organize suas{'\n'}jogatinas</Text>
        <Text style={[estilos.muted, { marginVertical: 16, fontSize: 15 }]}>
          Crie grupos para jogar seus games favoritos com seus amigos
        </Text>
        <BotaoDiscord texto="Entrar com Discord" onPress={() => trocarPara('home')} />
      </View>
    </View>
  );
}

function TelaHome({ irPara, partidas, filtro, setFiltro }) {
  const lista = filtro ? partidas.filter((p) => p.categoria === filtro) : partidas;

  return (
    <View style={estilos.tela}>
      <View style={estilos.topoHome}>
        <View style={{ flexDirection: 'row', alignItems: 'center', gap: 12 }}>
          <View style={estilos.avatarGrande}>
            <Text style={{ color: '#fff', fontWeight: '700' }}>{usuario.inicial}</Text>
          </View>
          <View>
            <Text style={{ color: '#fff', fontSize: 18 }}>
              Olá, <Text style={{ fontWeight: '700' }}>{usuario.nome}</Text>
            </Text>
            <Text style={estilos.muted}>Hoje é dia de vitória</Text>
          </View>
        </View>
        <TouchableOpacity style={estilos.btnMais} onPress={() => irPara('agendar')}>
          <Text style={{ color: '#fff', fontSize: 24, marginTop: -2 }}>+</Text>
        </TouchableOpacity>
      </View>
      
      <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
        {/*Usei map() para percorrer os arrays e gerar os componentes automaticamente. 
        Assim não preciso escrever manualmente um card para cada categoria ou partida.*/}
        {categorias.map((c) => (
          <CardCategoria
            key={c.id} //A key identifica cada elemento da lista para o React conseguir controlar os elementos de forma adequada.
            categoria={c}
            ativa={filtro === c.id}
            onPress={() => setFiltro(filtro === c.id ? null : c.id)}
          />
        ))}
      </ScrollView>

      <View style={estilos.tituloLista}>
        <Text style={estilos.tituloListaTexto}>Partidas agendadas</Text>
        <Text style={estilos.muted}>Total {lista.length}</Text>
      </View>

      <ScrollView showsVerticalScrollIndicator={false}>
        {lista.length === 0 && (
          <Text style={[estilos.muted, { textAlign: 'center', marginTop: 24 }]}>
            Nenhuma partida nessa categoria
          </Text>
        )}
        {lista.map((partida) => (
          <CardPartida
            key={partida.id}
            partida={partida}
            onPress={() => irPara('detalhes', { id: partida.id })}
          />
        ))}
      </ScrollView>
    </View>
  );
}

function TelaDetalhes({ params, voltar, partidas }) {
  const partida = partidas.find((p) => p.id === params.id);
  const servidor = servidorPorId(partida.servidor);

  const compartilhar = () => {
    Share.share({ title: servidor.nome, message: partida.descricao });
  };

  

  return (
    <View style={[estilos.tela, { padding: 0 }]}>
      <View style={[estilos.banner, { backgroundColor: servidor.cor }]}>
        <Cabecalho
          titulo="Detalhes"
          onVoltar={voltar}
          direita={
            <TouchableOpacity onPress={compartilhar}>
              <Text style={{ color: '#e51c44', fontSize: 18 }}>⇪</Text>
            </TouchableOpacity>
          }
        />
        <Text style={estilos.tituloBanner}>{servidor.nome}</Text>
        <Text style={estilos.textoBanner}>{partida.descricao}</Text>
      </View>

      <View style={{ padding: 20 }}>
        <View style={estilos.tituloLista}>
          <Text style={estilos.tituloListaTexto}>Jogadores</Text>
          <Text style={estilos.muted}>Total {jogadores.length}</Text>
        </View>
        {jogadores.map((j) => (
          <CardJogador key={j.nome} jogador={j} />
        ))}
      </View>

      <View style={{ padding: 20, marginTop: 'auto' }}>
        <BotaoDiscord texto="Entrar na partida" />   
      </View>
    </View>
  );
} // não implementei a lógica de entrar na partida, só o botão mesmo(onpress)

function TelaAgendar({ voltar, setPartidas }) {
  const [categoriaEscolhida, setCategoriaEscolhida] = useState(null);
  const [servidorId, setServidorId] = useState(servidores[0].id);
  const [dia, setDia] = useState('');
  const [mes, setMes] = useState('');
  const [hora, setHora] = useState('');
  const [minuto, setMinuto] = useState('');
  const [descricao, setDescricao] = useState('');
  const [erro, setErro] = useState('');

  const servidor = servidorPorId(servidorId);
  const soNumero = (texto) => texto.replace(/\D/g, '');
  const numeroValido = (texto, min, max) => {
    const n = Number(texto);
    return texto !== '' && n >= min && n <= max;
  };

  const proximoServidor = () => {
    const indice = servidores.findIndex((s) => s.id === servidorId);
    const proximo = servidores[(indice + 1) % servidores.length];
    setServidorId(proximo.id);
  };

  const agendar = () => {
    if (!categoriaEscolhida) return setErro('Escolha uma categoria');
    if (!numeroValido(dia, 1, 31) || !numeroValido(mes, 1, 12)) return setErro('Confira o dia e o mês');
    if (!numeroValido(hora, 0, 23) || !numeroValido(minuto, 0, 59)) return setErro('Confira o horário');

    setPartidas((atual) => [
      ...atual, //Usei o operador spread para manter todas as partidas que já existiam e adicionar a nova no final do array.
     // senao acabaria substituindo a lista anterior pela nova informação
      {
        id: Date.now(),
        servidor: servidorId,
        categoria: categoriaEscolhida,
        data: `${dia.padStart(2, '0')}/${mes.padStart(2, '0')}`,
        hora: `${hora.padStart(2, '0')}:${minuto.padStart(2, '0')}`,
        papel: 'anfitriao',
        descricao: descricao || 'Sem descrição',
      },
    ]);

    voltar();
  };

  return (
    <View style={estilos.tela}>
      <Cabecalho titulo="Agendar partida" onVoltar={voltar} />

      <ScrollView showsVerticalScrollIndicator={false}>
        <Text style={estilos.campoTitulo}>Categoria</Text>
        <ScrollView horizontal showsHorizontalScrollIndicator={false} style={{ marginBottom: 20 }}>
          {categorias.map((c) => (
            <CardCategoria
              key={c.id}
              categoria={c}
              ativa={categoriaEscolhida === c.id}
              onPress={() => setCategoriaEscolhida(c.id)}
            />
          ))}
        </ScrollView>

        {/* toco no card pra trocar o servidor, mais simples que um seletor nativo */}
        <TouchableOpacity style={estilos.servidorCard} onPress={proximoServidor}>
          <View style={[estilos.capa, { backgroundColor: servidor.cor, width: 48, height: 56 }]}>
            <Text style={estilos.capaTexto}>{servidor.nome[0]}</Text>
          </View>
          <View style={{ flex: 1 }}>
            <Text style={{ color: '#fff', fontSize: 17, fontWeight: '700' }}>{servidor.nome}</Text>
            <Text style={estilos.muted}>{servidor.jogo}</Text>
          </View>
          <Text style={{ color: '#8a93c9', fontSize: 22 }}>›</Text>
        </TouchableOpacity>

        <View style={estilos.linhaData}>
          <View>
            <Text style={estilos.campoTitulo}>Dia e mês</Text>
            <View style={estilos.par}>
              <TextInput style={estilos.entrada} value={dia} onChangeText={(t) => setDia(soNumero(t))} placeholder="DD" placeholderTextColor="#8a93c9" keyboardType="number-pad" maxLength={2} />
              <Text style={{ color: '#fff' }}>/</Text>
              <TextInput style={estilos.entrada} value={mes} onChangeText={(t) => setMes(soNumero(t))} placeholder="MM" placeholderTextColor="#8a93c9" keyboardType="number-pad" maxLength={2} />
            </View>
          </View>
          <View>
            <Text style={estilos.campoTitulo}>Horário</Text>
            <View style={estilos.par}>
              <TextInput style={estilos.entrada} value={hora} onChangeText={(t) => setHora(soNumero(t))} placeholder="HH" placeholderTextColor="#8a93c9" keyboardType="number-pad" maxLength={2} />
              <Text style={{ color: '#fff' }}>:</Text>
              <TextInput style={estilos.entrada} value={minuto} onChangeText={(t) => setMinuto(soNumero(t))} placeholder="MM" placeholderTextColor="#8a93c9" keyboardType="number-pad" maxLength={2} />
            </View>
          </View>
        </View>

        <View style={{ marginTop: 20 }}>
          <View style={estilos.linha}>
            <Text style={estilos.campoTitulo}>Descrição</Text>
            <Text style={estilos.muted}>Max 100 caracteres</Text>
          </View>
          <TextInput
            style={estilos.descricao}
            value={descricao}
            onChangeText={setDescricao}
            multiline
            maxLength={100}
            placeholder="Escreva aqui"
            placeholderTextColor="#8a93c9"
          />
        </View>

        {erro !== '' && <Text style={estilos.erro}>{erro}</Text>}
       {/*Utilizei TouchableOpacity para criar elementos clicáveis no React Native. O onPress define a função executada quando o usuário toca no elemento.*/}
        <TouchableOpacity style={estilos.btnPrincipal} onPress={agendar}> 
          <Text style={{ color: '#fff', fontSize: 18, fontWeight: '700' }}>Agendar</Text>
        </TouchableOpacity>
      </ScrollView>
    </View>
  );
}

// controle das telas

export default function App() {
  // guardo o histórico como pilha, assim o voltar só tira o último item
  const [historico, setHistorico] = useState([{ nome: 'login', params: {} }]);
  const [partidas, setPartidas] = useState(partidasIniciais);
  const [filtro, setFiltro] = useState(null);

  const atual = historico[historico.length - 1];

  const irPara = (nome, params = {}) => setHistorico((h) => [...h, { nome, params }]);
  const voltar = () => setHistorico((h) => (h.length > 1 ? h.slice(0, -1) : h));
  const trocarPara = (nome) => setHistorico([{ nome, params: {} }]);

  return (
    <SafeAreaView style={{ flex: 1, backgroundColor: '#0b1240' }}>
      {atual.nome === 'login' && <TelaLogin trocarPara={trocarPara} />}
      {atual.nome === 'home' && (
        <TelaHome irPara={irPara} partidas={partidas} filtro={filtro} setFiltro={setFiltro} />
      )}
      {atual.nome === 'detalhes' && (
        <TelaDetalhes params={atual.params} voltar={voltar} partidas={partidas} />
      )}
      {atual.nome === 'agendar' && <TelaAgendar voltar={voltar} setPartidas={setPartidas} />}
    </SafeAreaView>
  );
}

registerRootComponent(App);

// estilos 
// deixei tudo num StyleSheet do React Native só, separado por tela pra facilitar de achar, concentrando os estilos em um só lugar.

const estilos = StyleSheet.create({
  tela: { flex: 1, padding: 20 },
  muted: { color: '#8a93c9', fontSize: 13 },

  btnDiscord: { flexDirection: 'row', height: 56, borderRadius: 8, backgroundColor: '#e51c44', overflow: 'hidden' },
  btnIcone: { width: 56, alignItems: 'center', justifyContent: 'center', backgroundColor: '#b8112f' },
  btnTexto: { flex: 1, alignItems: 'center', justifyContent: 'center' },
  btnTextoTexto: { color: '#fff', fontSize: 17, fontWeight: '700' },
  btnPrincipal: { height: 56, marginTop: 24, borderRadius: 8, backgroundColor: '#e51c44', alignItems: 'center', justifyContent: 'center' },

  cabecalho: { flexDirection: 'row', alignItems: 'center', justifyContent: 'space-between', height: 48, marginBottom: 8 },
  btnTopo: { width: 40, height: 40, alignItems: 'center', justifyContent: 'center' },
  setaVoltar: { color: '#fff', fontSize: 28 },
  tituloCabecalho: { color: '#fff', fontSize: 20, fontWeight: '700' },

  categoria: { width: 100, height: 100, marginRight: 12, alignItems: 'center', justifyContent: 'center', gap: 8, backgroundColor: '#151d5c', borderWidth: 1, borderColor: '#232d7a', borderRadius: 8 },
  categoriaAtiva: { borderColor: '#e51c44' },
  categoriaTexto: { color: '#fff', fontSize: 14, fontWeight: '600' },
  bolinha: { position: 'absolute', top: 8, right: 8, width: 8, height: 8, borderRadius: 4, backgroundColor: '#e51c44' },

  tituloLista: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', paddingBottom: 10, marginBottom: 6, borderBottomWidth: 1, borderBottomColor: '#232d7a' },
  tituloListaTexto: { color: '#fff', fontSize: 18, fontWeight: '700' },

  partida: { flexDirection: 'row', alignItems: 'center', gap: 14, paddingVertical: 12, borderBottomWidth: 1, borderBottomColor: '#232d7a' },
  capa: { width: 52, height: 60, alignItems: 'center', justifyContent: 'center', borderRadius: 8 },
  capaTexto: { color: '#fff', fontSize: 22, fontWeight: '700' },
  linha: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center' },
  nomeServidor: { color: '#fff', fontSize: 16, fontWeight: '700' },

  jogador: { flexDirection: 'row', alignItems: 'center', gap: 12, paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#232d7a' },
  avatar: { width: 40, height: 40, borderRadius: 20, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e51c44' },
  avatarGrande: { width: 48, height: 48, borderRadius: 24, alignItems: 'center', justifyContent: 'center', backgroundColor: '#e51c44' },

  loginImagem: { height: 320, alignItems: 'center', justifyContent: 'center', backgroundColor: '#1a2470' },
  tituloLogin: { color: '#fff', fontSize: 34, fontWeight: '700', lineHeight: 38 },

  topoHome: { flexDirection: 'row', justifyContent: 'space-between', alignItems: 'center', marginBottom: 20 },
  btnMais: { width: 48, height: 48, borderRadius: 8, backgroundColor: '#e51c44', alignItems: 'center', justifyContent: 'center' },

  banner: { padding: 20, paddingBottom: 24, justifyContent: 'flex-end', minHeight: 220 },
  tituloBanner: { color: '#fff', fontSize: 28, fontWeight: '700', marginTop: 16 },
  textoBanner: { color: '#cdd2ee', fontSize: 14, marginTop: 6, lineHeight: 19 },

  campoTitulo: { color: '#fff', fontSize: 16, fontWeight: '700', marginBottom: 10 },
  servidorCard: { flexDirection: 'row', alignItems: 'center', gap: 14, padding: 10, marginBottom: 20, backgroundColor: '#151d5c', borderWidth: 1, borderColor: '#232d7a', borderRadius: 8 },
  linhaData: { flexDirection: 'row', justifyContent: 'space-between', marginBottom: 4 },
  par: { flexDirection: 'row', alignItems: 'center', gap: 8 },
  entrada: { width: 48, height: 52, textAlign: 'center', color: '#fff', fontSize: 17, fontWeight: '700', backgroundColor: '#151d5c', borderWidth: 1, borderColor: '#232d7a', borderRadius: 8 },
  descricao: { height: 110, padding: 12, color: '#fff', fontSize: 14, backgroundColor: '#151d5c', borderWidth: 1, borderColor: '#232d7a', borderRadius: 8, textAlignVertical: 'top' },
  erro: { color: '#e51c44', fontSize: 13, textAlign: 'center', marginTop: 12 },
});