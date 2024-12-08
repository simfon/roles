const Stories = require('../models/stories');

const baseStories = [{
  location: {
    name: 'Locanda della Lucertola',
    description: 'La più antica e frequentata, al Porto della capitale.',
    img: 'tavern.jpg',
  },
  stories: [{
    title: 'Notte di Tempesta',
    maxPlayers: 2,
    type: 'one-shot',
    synopsis: 'Guardati le spalle',
    starter: 'Lampi, tuoni, fulmini e saette: la tempesta perfetta, alla quale cercate di sfuggire mentre il vento vi sbatte in faccia l\'acqua salmsastra del Porto. Trovate riparo alla Locanda della Lucertola, ma nella notte sbagliata.',
    hints: ['Il tuo personaggio è una Guardia Cittadina; ben conosciuto, ma non un pezzo grosso. Anche se le tue abilità non sembrano adatte, tutti hanno pur bisogno di un mestiere, no? Eri in attesa di imbarcarti, destinazione a piacere, ma la tempesta ha scombinato i tuoi piani. Cerchi riparo tuffandoti nella Locanda dove, qualsiasi cosa accada, farai tutto ciò che ti è possibile per passare la notte.',
      'Detesti fare il Palo, ma questa notte è il tuo turno. Mentre il resto della Banda traffica nello scantinato, smerciando un carico di Loto Nero fresco di giornata, una persona irrompe nella Locanda: la riconosci, è una Guardia Cittadina. Al mattino il Loto Nero dovrà salpare per essere distribuito ad altri porti, e non puoi permettere che la Guardia resti alla Locanda. Non puoi allertare il resto della banda: il Capo non ti perdonerebbe mai per non aver saputo gestire un singolo, semplice, imprevisto. Fai tutto ciò che è in tuo potere per allontanare la Guardia'],
  }],
}, {
  location: {
    name: 'Tempio della Grande Madre',
    description: 'Incensi, preghiere e belle vestali. Peccato per i voti di verginità.',
    img: 'temple.jpg',
  },
  stories: [{
    title: 'Crisantemo',
    maxPlayers: 2,
    type: 'one-shot',
    synopsis: 'Uno sporco Ricatto.',
    starter: 'In un bel pomeriggio di primavera, un viandante ed un sacerdote si incontrano alle porte del Tempio. Tra i fiori che sbocciano, le rondini che ritornano, nulla è come sembra.',
    hints: ['La tua vita ha preso una brutta piega. Nonostante il tuo passato, fame e debiti hanno preso il sopravvento. Rovistando nella spazzatura per trovare del cibo, sei incappato in una pergamena sigillata. Dentro, con un po’ di inventiva, hai trovato il tuo biglietto per l’uscita dalla miseria: una lettera d’amore firmata ‘Crisantemo’, sigillata dal timbro del Tempio. Dal suo contenuto, la faccenda è ben evidente: un sacerdote, venendo meno ai suoi obblighi, pianifica una fuga d’amore. Va al Tempio, scova Crisantemo: è tempo di battere cassa.',
      'Poco contano le tue esperienze passate: ora sei un Sacerdote del Tempio. Non uno dei migliori, però. Forse non avresti dovuto inviare quella lettera al tuo Amore, e forse non avresti dovuto usare il Sigillo del Tempio per premere la ceralacca, ma al cuore non si comanda. In fondo, non hai usato il tuo nome: come potrebbero mai scovare ‘Crisantemo’? Stai pianificando una fuga in grande stile: l’oro raccolto nell’ultimo mese permetterà a te ed al  tuo Amore una lunga estate tranquilla. Sogno, promessa, e segreto che difenderai ad ogni costo. Anche oggi, mentre uno strano viandante si avvicina...'],
  },
  {
    title: 'Crisantemo',
    maxPlayers: 3,
    type: 'one-shot',
    synopsis: 'Uno sporco Ricatto.',
    starter: 'In un bel pomeriggio di primavera, un viandante ed un sacerdote si incontrano alle porte del Tempio. Tra i fiori che sbocciano, le rondini che ritornano, nulla è come sembra.',
    hints: ['La tua vita ha preso una brutta piega. Nonostante il tuo passato, fame e debiti hanno preso il sopravvento. Rovistando nella spazzatura per trovare del cibo, sei incappato in una pergamena sigillata. Dentro, con un po’ di inventiva, hai trovato il tuo biglietto per l’uscita dalla miseria: una lettera d’amore firmata ‘Crisantemo’, sigillata dal timbro del Tempio. Dal suo contenuto, la faccenda è ben evidente: un sacerdote, venendo meno ai suoi obblighi, pianifica una fuga d’amore. Va al Tempio, scova Crisantemo: è tempo di battere cassa.',
      'Poco contano le tue esperienze passate: ora sei un Sacerdote del Tempio. Non uno dei migliori, però. Forse non avresti dovuto inviare quella lettera al tuo Amore, e forse non avresti dovuto usare il Sigillo del Tempio per premere la ceralacca, ma al cuore non si comanda. In fondo, non hai usato il tuo nome: come potrebbero mai scovare ‘Crisantemo’? Stai pianificando una fuga in grande stile: l’oro raccolto nell’ultimo mese permetterà a te ed al  tuo Amore una lunga estate tranquilla. Sogno, promessa, e segreto che difenderai ad ogni costo. Anche oggi, mentre uno strano viandante si avvicina...',
      'Sei uno dei Sacerdoti del Tempio. Il tuo passato non conta molto: sono bastate una piccola crisi mistica, le preghiere giuste al momento giusto, e ti  sei ritrovato a gestire il Tesoro del Tempio. Da tempo sospetti che uno degli altri Sacerdoti pianifichi qualcosa di losco, o nasconda un segreto, ma non hai mai avuto modo di provarlo. Fortunatamente, proprio oggi finirai col  trovarti ben poco lontano da quel Sacerdote mentre un malconcio viandante lo avvicina... '],
  }],
}, {
  location: {
    name: 'La Locanda al Termine dell\'Universo',
    description: 'Una sottile parete di legno tra voi ed il vuoto cosmico.',
    img: 'elven.jpg',
  },
  stories: [{
    title: 'Notte senza Fine',
    maxPlayers: 4,
    type: 'one-shot',
    synopsis: 'Venti avventurieri intrappolati, mille storie.',
    starter: 'Si, è uno di quei casi di cosa che esiste solo per prendere posto e fare il terzo elemento. Un po\' come l\'accompagnatore agli appuntamenti',
    hints: ['Conto sulla tua fantasia, non deludermi.',
      'Conto sulla tua fantasia, non deludermi.',
      'Conto sulla tua fantasia, non deludermi.',
      'Conto sulla tua fantasia, non deludermi.'],
  }],
},
];

Stories.find().countDocuments().then((n) => {
  if (n === 0) {
    baseStories.map(story => new Stories(story).save());
  }
});
