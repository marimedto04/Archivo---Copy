import dotenv from 'dotenv'
import path from 'path'
import { fileURLToPath } from 'url'

const __filename = fileURLToPath(import.meta.url)
const __dirname = path.dirname(__filename)
dotenv.config({ path: path.resolve(__dirname, '../../../../server/.env') })
import { BaseService } from '../../../../server/src/core/BaseService.js'
import Groq from 'groq-sdk'

// ─────────────────────────────────────────────────────────────────────────────
// CONTENIDO COMPLETO DE LAS 15 MATERIAS (3 niveles × 5 materias)
// ─────────────────────────────────────────────────────────────────────────────
const SUBJECT_CONTENTS = {

    // ══════════════════════════════════════════════════════
    // NIVEL 1 — GRADOS 1° Y 2°
    // ══════════════════════════════════════════════════════

    '1-espanol': {
        name: 'Español', level: 1, slug: 'espanol', icon: '📝', color: '#E91E63',
        description: 'Aprende a leer y escribir con el abecedario, sílabas y palabras.',
        content: `El abecedario es el conjunto de letras que usamos para escribir en español. Está formado por vocales y consonantes. Las vocales son cinco: a, e, i, o, u, y son especiales porque suenan solas. Las consonantes son las demás letras del abecedario y necesitan unirse a una vocal para formar sonidos.

Cuando unimos una consonante con una vocal formamos una sílaba. Por ejemplo, la letra m con la vocal a forman la sílaba ma. Con las sílabas podemos construir palabras como mamá, mesa o mano. La lectura de palabras simples comienza reconociendo estas combinaciones de sílabas una por una.

La escritura de palabras es la forma en que representamos con letras lo que queremos decir. Los niños de primero y segundo aprenden a escribir su nombre, palabras del hogar y de la naturaleza. Poco a poco aprenden a unir palabras para formar oraciones simples, que tienen un sujeto y un predicado, como el gato come pescado.

Comprender un cuento corto significa entender qué pasó en la historia, dónde ocurrió y quiénes participaron. Los personajes son los seres que aparecen en el cuento, pueden ser personas, animales o seres fantásticos. Identificar los personajes principales y secundarios ayuda a entender mejor la historia y a disfrutar la lectura.`,
    },

    '1-matematicas': {
        name: 'Matemáticas', level: 1, slug: 'matematicas', icon: '🔢', color: '#2196F3',
        description: 'Aprende números, sumas, restas y formas geométricas.',
        content: `Los números son símbolos que usamos para contar y representar cantidades. En primero y segundo grado los estudiantes aprenden los números hasta el 100 y luego hasta el 1000, reconociendo cómo se escriben y cómo se leen. El conteo es la habilidad de decir los números en orden y de asociar cada número con una cantidad de objetos.

Las sumas o adiciones permiten unir dos o más cantidades para obtener un total. Por ejemplo, si tenemos 5 manzanas y añadimos 3 más, en total tenemos 8 manzanas. Las restas o sustracciones permiten quitar una cantidad a otra para saber cuánto queda. Si teníamos 8 manzanas y comemos 3, nos quedan 5.

Los problemas matemáticos sencillos presentan situaciones de la vida real donde hay que sumar o restar para encontrar la respuesta. Leer bien el problema y entender qué se pide es tan importante como hacer la operación. Las figuras geométricas básicas como el círculo, el cuadrado, el triángulo y el rectángulo se encuentran en los objetos del entorno cotidiano.

Comparar cantidades significa decir cuál es mayor, cuál es menor o si dos cantidades son iguales. Para comparar usamos los signos mayor que, menor que e igual que. Esta habilidad es fundamental para entender el valor de los números y resolver problemas cotidianos.`,
    },

    '1-ciencias': {
        name: 'Ciencias Naturales', level: 1, slug: 'ciencias', icon: '🌿', color: '#4CAF50',
        description: 'Conoce el cuerpo humano, los animales y la naturaleza.',
        content: `El cuerpo humano es una estructura maravillosa formada por muchas partes que trabajan juntas. Los niños de primero y segundo aprenden a identificar las partes externas del cuerpo como la cabeza, el tronco y las extremidades. Cada parte tiene una función importante para que podamos movernos, pensar y vivir.

Los cinco sentidos son la vista, el oído, el olfato, el gusto y el tacto. Con la vista podemos ver los colores y las formas. Con el oído escuchamos los sonidos, con el olfato percibimos los olores, con el gusto saboreamos los alimentos y con el tacto sentimos las texturas y temperaturas. Los sentidos nos permiten conocer e interactuar con el mundo que nos rodea.

Los animales se clasifican en domésticos, que viven con las personas como el perro y el gato, y salvajes, que viven en la naturaleza como el tigre y el águila. Las plantas son seres vivos que producen su propio alimento usando la luz del sol. Sus partes son la raíz, el tallo, las hojas, las flores y los frutos, y cada una cumple una función diferente.

El agua es un recurso fundamental para la vida de todos los seres vivos. Existe en estado líquido, sólido como el hielo y gaseoso como el vapor. El día y la noche ocurren porque la Tierra gira sobre sí misma. Cuando la parte donde vivimos queda de frente al Sol hay luz de día, y cuando queda de espaldas al Sol oscurece y llega la noche.`,
    },

    '1-sociales': {
        name: 'Ciencias Sociales', level: 1, slug: 'sociales', icon: '🏡', color: '#FF9800',
        description: 'Aprende sobre la familia, la escuela y la comunidad.',
        content: `La familia es el primer grupo al que pertenecemos. Está formada por personas que se quieren, se cuidan y viven juntas. Hay familias de muchos tipos: algunas tienen papá, mamá e hijos, otras están formadas por abuelos, tíos o solo uno de los padres. Todas son igual de importantes y merecen respeto.

La escuela es el lugar donde los niños van a aprender y a compartir con otros. En la escuela hay maestros, compañeros, salones, patios y bibliotecas. Las normas de convivencia son acuerdos que nos ayudan a vivir bien con los demás, como saludar, pedir la palabra, respetar el turno y cuidar los espacios comunes.

La comunidad es el conjunto de personas que viven en un mismo lugar y comparten costumbres. El barrio o la vereda es el espacio más cercano donde vivimos, jugamos y nos relacionamos con los vecinos. Conocer nuestro entorno nos ayuda a sentirnos parte de él y a cuidarlo.

Los oficios de la comunidad son los trabajos que realizan las personas para satisfacer las necesidades de todos. El médico cuida la salud, el maestro enseña, el tendero vende alimentos y el policía protege a los ciudadanos. Todos los oficios son valiosos y necesarios para que la comunidad funcione bien.`,
    },

    '1-ingles': {
        name: 'Inglés', level: 1, slug: 'ingles', icon: '🌍', color: '#9C27B0',
        description: 'Aprende saludos, colores, números y animales en inglés.',
        content: `Los saludos en inglés son palabras que usamos para comunicarnos con otras personas. Hello significa hola y se usa para saludar cuando llegamos a un lugar. Goodbye significa adiós y lo decimos cuando nos vamos. También podemos decir good morning para saludar en la mañana y good night para despedirnos en la noche.

Presentarse en inglés es decir quién somos. La frase my name is seguida del nombre nos sirve para presentarnos. Por ejemplo, my name is María. También podemos preguntar el nombre de otro diciendo what is your name. Los números en inglés del uno al diez son one, two, three, four, five, six, seven, eight, nine, ten.

Los colores más importantes en inglés son red para rojo, blue para azul, yellow para amarillo, green para verde, orange para naranja, white para blanco y black para negro. Aprender los colores ayuda a describir objetos y situaciones. Los animales en inglés tienen nombres diferentes, por ejemplo dog para perro, cat para gato, bird para pájaro y fish para pez.

Las partes del cuerpo en inglés incluyen head para cabeza, eyes para ojos, ears para orejas, nose para nariz, mouth para boca, hands para manos y feet para pies. Conocer estas palabras permite seguir instrucciones sencillas y participar en actividades de clase. Aprender inglés desde pequeños nos abre puertas para comunicarnos con personas de muchos países.`,
    },

    // ══════════════════════════════════════════════════════
    // NIVEL 2 — GRADOS 3° Y 4°
    // ══════════════════════════════════════════════════════

    '2-espanol': {
        name: 'Español', level: 2, slug: 'espanol', icon: '📝', color: '#E91E63',
        description: 'Comprensión lectora, signos de puntuación y tipos de textos.',
        content: `La lectura de textos cortos es una habilidad que se fortalece en tercero y cuarto grado. Los estudiantes leen cuentos, noticias breves, fábulas y cartas, identificando la idea principal y los detalles importantes. La comprensión lectora va más allá de leer las palabras: implica entender el mensaje, relacionarlo con experiencias propias y reflexionar sobre lo leído.

La escritura de párrafos es una competencia clave en estos grados. Un párrafo tiene una idea principal y varias oraciones que la desarrollan y explican. Los signos de puntuación como el punto, la coma, el signo de interrogación y el de exclamación ayudan a organizar las ideas y a dar el tono correcto a los textos. Usarlos bien hace que la escritura sea más clara y fácil de entender.

Los tipos de textos tienen características y propósitos diferentes. El cuento narra una historia con personajes, ambiente y trama. La fábula es una historia corta con animales como personajes que enseña una lección o moraleja. La carta es un texto dirigido a una persona específica con saludo, mensaje y despedida. Reconocer estas diferencias ayuda a leer y escribir con mayor intención.

Los sinónimos son palabras que tienen un significado parecido, como alegre y feliz. Los antónimos son palabras con significado contrario, como grande y pequeño. Conocer sinónimos y antónimos amplía el vocabulario y enriquece la narración de historias. Narrar una historia implica contar los hechos en orden, describir los personajes y mantener al lector interesado de principio a fin.`,
    },

    '2-matematicas': {
        name: 'Matemáticas', level: 2, slug: 'matematicas', icon: '🔢', color: '#2196F3',
        description: 'Multiplicación, división, fracciones y medidas.',
        content: `La multiplicación es una forma rápida de sumar grupos iguales. Multiplicar 4 por 3 significa sumar cuatro veces el número tres, lo que da como resultado doce. Las tablas de multiplicar son herramientas fundamentales que los estudiantes memorizan para hacer cálculos con mayor rapidez y seguridad. La división es la operación inversa de la multiplicación y permite repartir una cantidad en partes iguales.

Los problemas matemáticos en estos grados involucran más de una operación y requieren leer con atención para identificar los datos y la pregunta. Las fracciones básicas representan partes de un entero, como un medio, un tercio o un cuarto. Entender que un entero puede dividirse en partes iguales es esencial para comprender las fracciones.

Las medidas permiten expresar longitudes, pesos y tiempos con unidades como el metro, el kilogramo y el segundo. Comparar y convertir medidas son habilidades prácticas para la vida cotidiana. Las figuras geométricas planas como el cuadrado, el rectángulo, el triángulo y el círculo tienen propiedades que se estudian con mayor profundidad, incluyendo el cálculo del perímetro básico, que es la suma de todos sus lados.

Las gráficas simples como barras e imágenes permiten organizar y presentar información de manera visual. Leer e interpretar gráficas es una habilidad importante para entender datos del entorno como resultados de encuestas o comparaciones de cantidades. Estas herramientas matemáticas preparan a los estudiantes para analizar información en contextos reales.`,
    },

    '2-ciencias': {
        name: 'Ciencias Naturales', level: 2, slug: 'ciencias', icon: '🌿', color: '#4CAF50',
        description: 'Ecosistemas, ciclo del agua, estados de la materia y energía.',
        content: `Un ecosistema es el conjunto de seres vivos que habitan en un mismo lugar y se relacionan entre sí y con el ambiente que los rodea. Existen ecosistemas terrestres como los bosques y los desiertos, y acuáticos como los ríos y los mares. Cada ecosistema tiene condiciones únicas de temperatura, humedad y suelo que determinan qué plantas y animales pueden vivir allí.

Los animales vertebrados son los que tienen columna vertebral, como los peces, los anfibios, los reptiles, las aves y los mamíferos. Los invertebrados carecen de columna vertebral y son los más numerosos del planeta, como los insectos, los gusanos y las estrellas de mar. Clasificar los animales ayuda a entender sus características, comportamientos y hábitats.

El ciclo del agua describe el movimiento continuo del agua en la naturaleza. El agua de ríos, lagos y mares se evapora con el calor del sol, sube a la atmósfera y forma las nubes. Luego cae de nuevo en forma de lluvia o nieve, y regresa a los cuerpos de agua. Los estados de la materia son sólido, líquido y gaseoso, y el agua es un ejemplo perfecto de cómo una sustancia puede cambiar entre estos estados.

La energía es la capacidad de producir cambios y movimientos. Existe en diferentes formas como la energía solar, eléctrica, mecánica y calorífica. Cuidar el medio ambiente es responsabilidad de todos; acciones como reciclar, ahorrar agua y no contaminar ayudan a proteger los ecosistemas y garantizan que las futuras generaciones puedan disfrutar de los recursos naturales.`,
    },

    '2-sociales': {
        name: 'Ciencias Sociales', level: 2, slug: 'sociales', icon: '🏡', color: '#FF9800',
        description: 'Municipios, regiones de Colombia, mapas e historia.',
        content: `Colombia está organizada territorialmente en municipios y departamentos. Los municipios son las unidades más pequeñas y están agrupados en departamentos, que son como grandes regiones con gobierno propio. El país tiene 32 departamentos y cada uno tiene una capital. Bogotá es la capital del país y una de las ciudades más grandes de América Latina.

Colombia se divide en regiones naturales con características muy distintas. Las principales son la región Andina, la Caribe, la Pacífica, la Orinoquía, la Amazonía y la región Insular. Cada región tiene su propia geografía, clima, flora y fauna. Los mapas son representaciones gráficas del territorio que permiten ubicarse en el espacio, identificar fronteras, ríos, montañas y ciudades.

La historia básica de Colombia incluye el reconocimiento de los pueblos indígenas que habitaron el territorio antes de la llegada de los españoles. Las culturas indígenas como los muiscas, los taironas y los zenúes tenían lenguas, tradiciones, sistemas de gobierno y formas de producción propias que aún se conservan en parte. La conquista española transformó profundamente estas culturas.

Las tradiciones culturales de Colombia son el resultado de la mezcla entre las culturas indígena, europea y africana. Fiestas, músicas, danzas y gastronomías varían de región en región y reflejan esta diversidad. Conocer y valorar las tradiciones culturales fortalece la identidad y el sentido de pertenencia a la nación.`,
    },

    '2-ingles': {
        name: 'Inglés', level: 2, slug: 'ingles', icon: '🌍', color: '#9C27B0',
        description: 'Familia, comida, días de la semana y descripciones.',
        content: `La familia en inglés se describe con palabras como family para familia, mother para mamá, father para papá, brother para hermano, sister para hermana y grandparents para abuelos. Hablar sobre la familia es una de las primeras conversaciones que se aprenden en inglés. Los alimentos y frutas también tienen nombres en inglés que son útiles para el día a día, como apple para manzana, banana para banano, rice para arroz y milk para leche.

Los días de la semana en inglés son Monday, Tuesday, Wednesday, Thursday, Friday, Saturday y Sunday. Es importante aprenderlos en orden y saber cuáles son días de colegio y cuáles son de descanso. Los meses del año son January, February, March, April, May, June, July, August, September, October, November y December, y se usan para hablar de fechas, cumpleaños y festividades.

Los objetos del salón de clases en inglés incluyen palabras como pencil para lápiz, notebook para cuaderno, book para libro, eraser para borrador y ruler para regla. Conocer el nombre de los útiles escolares en inglés facilita seguir instrucciones durante la clase. Las descripciones simples usan adjetivos como big para grande, small para pequeño, tall para alto, short para bajo, old para viejo y new para nuevo.

Hacer descripciones en inglés permite comunicar cómo son las personas, los objetos y los lugares. Por ejemplo, se puede decir the cat is small and white para describir un gato pequeño y blanco. Practicar estas estructuras sencillas fortalece la confianza para comunicarse en inglés de manera progresiva y natural.`,
    },

    // ══════════════════════════════════════════════════════
    // NIVEL 3 — GRADO 5°
    // ══════════════════════════════════════════════════════

    '3-espanol': {
        name: 'Español', level: 3, slug: 'espanol', icon: '📝', color: '#E91E63',
        description: 'Comprensión avanzada, producción de textos y comunicación.',
        content: `La comprensión de textos más largos es una habilidad central en quinto grado. Los estudiantes leen artículos, cuentos extensos y textos informativos, identificando la idea principal, las ideas secundarias y la intención del autor. Hacer resúmenes es una estrategia fundamental que consiste en seleccionar la información más importante de un texto y expresarla con las propias palabras, de manera breve y organizada.

Los tipos de textos se amplían en este grado. El cuento tiene estructura narrativa con introducción, nudo y desenlace. La noticia informa sobre hechos reales con datos precisos como quién, qué, cuándo, dónde y por qué. La carta puede ser formal o informal y se dirige a un destinatario específico con un propósito claro. Reconocer la estructura de cada tipo de texto ayuda tanto a leerlos como a producirlos con mayor calidad.

El uso correcto de los signos de puntuación es indispensable para escribir con claridad. El punto separa oraciones y párrafos. La coma organiza listas y frases dentro de una oración. Los signos de interrogación y exclamación expresan preguntas y emociones. El uso adecuado de las mayúsculas al inicio de oraciones y en nombres propios también hace parte de la escritura correcta.

La producción de textos propios es el resultado de integrar todas las habilidades aprendidas. Los estudiantes planifican lo que van a escribir, redactan un borrador, lo revisan y lo mejoran antes de presentarlo. Escribir con coherencia, cohesión y corrección ortográfica son los objetivos principales de la producción textual en este nivel.`,
    },

    '3-matematicas': {
        name: 'Matemáticas', level: 3, slug: 'matematicas', icon: '🔢', color: '#2196F3',
        description: 'Fracciones, decimales, área, perímetro y operaciones combinadas.',
        content: `Las fracciones representan partes de un entero y se expresan con un numerador y un denominador. El numerador indica cuántas partes se toman y el denominador cuántas partes tiene el entero en total. Sumar, restar, comparar y simplificar fracciones son operaciones que los estudiantes de quinto dominan progresivamente. Los decimales son otra forma de representar partes de un entero y están relacionados directamente con el sistema de numeración de base diez.

Los problemas matemáticos más complejos en este grado involucran varias operaciones y requieren identificar datos relevantes, descartar información innecesaria y plantear una estrategia de solución. El análisis y la comprensión del enunciado son tan importantes como la operación matemática. El área es la medida de la superficie de una figura y se expresa en unidades cuadradas. El perímetro es la distancia alrededor de una figura y se calcula sumando sus lados.

Las gráficas y tablas permiten organizar, leer e interpretar conjuntos de datos. Las gráficas de barras, líneas y circulares son las más comunes y cada una es útil para diferentes tipos de información. Leer una gráfica implica identificar sus partes, comparar los datos y sacar conclusiones a partir de ellos. Esta habilidad es fundamental para analizar información del entorno real.

Las operaciones combinadas son ejercicios que incluyen sumas, restas, multiplicaciones y divisiones en una misma expresión. Para resolverlas correctamente se aplica el orden de las operaciones: primero las que están entre paréntesis, luego multiplicaciones y divisiones, y finalmente sumas y restas. Practicar operaciones combinadas desarrolla el pensamiento lógico y la precisión matemática.`,
    },

    '3-ciencias': {
        name: 'Ciencias Naturales', level: 3, slug: 'ciencias', icon: '🌿', color: '#4CAF50',
        description: 'Sistemas del cuerpo humano, energía, ecosistemas y conservación.',
        content: `El cuerpo humano está organizado en sistemas que trabajan de manera coordinada. El sistema digestivo procesa los alimentos y extrae los nutrientes. El sistema respiratorio lleva el oxígeno al cuerpo y expulsa el dióxido de carbono. El sistema circulatorio transporta la sangre, los nutrientes y el oxígeno a todas las células. El sistema nervioso coordina las funciones del cuerpo y nos permite pensar, sentir y movernos.

La energía y la fuerza son conceptos fundamentales en ciencias naturales. La fuerza es una acción que puede cambiar el movimiento o la forma de un objeto. La energía es la capacidad de producir trabajo o cambio. Existen diferentes tipos de energía como la cinética, que es la del movimiento, y la potencial, que es la que está almacenada. La energía solar es la fuente principal de energía en la Tierra.

La materia puede sufrir cambios físicos y químicos. Los cambios físicos modifican la forma o el estado de la materia sin cambiar su composición, como derretir hielo. Los cambios químicos transforman la composición de la materia y producen nuevas sustancias, como quemar papel. Reconocer estos cambios es importante para entender los procesos del entorno natural e industrial.

Los ecosistemas y la biodiversidad son temas centrales en este nivel. La biodiversidad es la variedad de seres vivos que existen en un ecosistema. Colombia es uno de los países más biodiversos del mundo gracias a su variedad de climas y geografías. La conservación del ambiente implica proteger los ecosistemas, reducir la contaminación y usar los recursos naturales de forma responsable para garantizar la vida de las generaciones futuras.`,
    },

    '3-sociales': {
        name: 'Ciencias Sociales', level: 3, slug: 'sociales', icon: '🏡', color: '#FF9800',
        description: 'Historia de Colombia, organización política, derechos y geografía.',
        content: `La historia de Colombia comienza mucho antes de la llegada de los españoles, con la existencia de numerosos pueblos indígenas. La colonización española inició a finales del siglo XV y durante casi tres siglos los españoles controlaron el territorio, imponiendo su lengua, religión y formas de gobierno. El proceso de independencia comenzó el 20 de julio de 1810 y culminó con varias batallas que liberaron al país del dominio español, siendo la Batalla de Boyacá en 1819 la más decisiva.

La organización política básica de Colombia establece que el país es una República democrática dividida en tres ramas del poder público: la ejecutiva, liderada por el Presidente; la legislativa, conformada por el Congreso; y la judicial, que administra la justicia. Esta separación de poderes garantiza el equilibrio y el funcionamiento del Estado.

Los derechos y deberes de los ciudadanos están consagrados en la Constitución Política de 1991. Los derechos incluyen la educación, la salud, la libertad y la participación. Los deberes incluyen respetar la ley, cuidar el ambiente y contribuir al bien común. Conocer los derechos y deberes forma ciudadanos responsables y participativos.

La economía básica estudia cómo las personas, las familias y los países producen, distribuyen y consumen bienes y servicios. Colombia tiene una economía variada basada en la agricultura, la minería, la industria y el comercio. La geografía de Colombia es muy diversa, con cordilleras, valles, llanuras, selvas y costas que influyen directamente en las actividades económicas y en la forma de vida de sus habitantes.`,
    },

    '3-ingles': {
        name: 'Inglés', level: 3, slug: 'ingles', icon: '🌍', color: '#9C27B0',
        description: 'Frases completas, rutinas diarias y conversaciones simples.',
        content: `En quinto grado los estudiantes construyen frases completas en inglés con sujeto, verbo y complemento. Por ejemplo, I like playing soccer significa me gusta jugar fútbol. Las descripciones en inglés permiten hablar sobre personas, objetos y lugares usando adjetivos y estructuras como she is tall and friendly para decir que ella es alta y amigable. Practicar estas estructuras amplía la capacidad comunicativa de los estudiantes.

Las rutinas diarias en inglés se expresan con verbos de acción y expresiones de tiempo. Por ejemplo, I wake up at six o clock significa me despierto a las seis. I have breakfast, then I go to school quiere decir desayuno y luego voy al colegio. Hablar sobre las rutinas ayuda a usar el presente simple con naturalidad y a organizar la información de manera secuencial.

Los lugares en inglés incluyen palabras como school para colegio, park para parque, library para biblioteca, hospital para hospital y store para tienda. Conocer estos vocabularios permite describir el entorno y entender instrucciones sobre cómo llegar a diferentes sitios. Las preguntas básicas como where is the school o how much does it cost son herramientas esenciales para comunicarse en situaciones cotidianas.

Las conversaciones simples en inglés combinan saludos, presentaciones, preguntas y respuestas en un intercambio fluido. Por ejemplo, una conversación puede comenzar con hello, how are you y continuar con I am fine, thank you. Practicar diálogos cortos sobre temas conocidos como la familia, la escuela y los gustos permite ganar confianza y fluidez en el idioma de manera progresiva y significativa.`,
    },
}

// ─────────────────────────────────────────────────────────────────────────────
// Construir índices con IDs numéricos
// ─────────────────────────────────────────────────────────────────────────────
let _counter = 1
const SUBJECTS_BY_LEVEL = {}
const SUBJECTS_BY_ID = {}

Object.entries(SUBJECT_CONTENTS).forEach(([, data]) => {
    const subject = { ...data, id: _counter++ }
    if (!SUBJECTS_BY_LEVEL[subject.level]) SUBJECTS_BY_LEVEL[subject.level] = []
    SUBJECTS_BY_LEVEL[subject.level].push(subject)
    SUBJECTS_BY_ID[subject.id] = subject
})

// ─────────────────────────────────────────────────────────────────────────────
// Cache de embeddings en memoria RAM del servidor
// ─────────────────────────────────────────────────────────────────────────────
const _chunkCache = {}

// ─────────────────────────────────────────────────────────────────────────────
// Groq client (lazy — se instancia solo cuando llega la primera petición)
// ─────────────────────────────────────────────────────────────────────────────
let _groq = null
function getGroq() {
    if (_groq) return _groq
    const key = process.env.GROQ_API_KEY
    if (!key || key.includes('pega_aqui')) {
        throw new Error('GROQ_API_KEY no configurada. Agrégala al archivo server/.env')
    }
    _groq = new Groq({ apiKey: key })
    return _groq
}

// ─────────────────────────────────────────────────────────────────────────────
// Modelo de embeddings MiniLM (lazy — se descarga una sola vez ~23 MB)
// ─────────────────────────────────────────────────────────────────────────────
let _embedder = null
async function getEmbedder() {
    if (_embedder) return _embedder
    const { pipeline } = await import('@xenova/transformers')
    _embedder = await pipeline('feature-extraction', 'Xenova/all-MiniLM-L6-v2')
    console.log('✅ Modelo MiniLM-L6-v2 cargado (23 MB, sin GPU)')
    return _embedder
}

// ─────────────────────────────────────────────────────────────────────────────
// Servicio principal
// ─────────────────────────────────────────────────────────────────────────────
export class ChatbotService extends BaseService {

    // ── Endpoints públicos ────────────────────────────────────────────────────

    /**
     * Devuelve materias de un nivel sin el campo content (es pesado).
     * @param {number} level
     */
    getSubjectsByLevel(level) {
        const list = SUBJECTS_BY_LEVEL[level]
        if (!list) this.throwError(`Nivel ${level} no existe.`, 404)
        return { subjects: list.map(({ content: _, ...rest }) => rest) }
    }

    /**
     * Devuelve el contenido completo de una materia para guardar offline.
     * @param {number} subjectId
     */
    getSubjectContent(subjectId) {
        const s = SUBJECTS_BY_ID[subjectId]
        if (!s) this.throwNotFound('Materia')
        const { content, ...rest } = s
        return { subject: rest, content }
    }

    /**
     * Flujo RAG completo: chunking → embedding → similitud coseno → LLM.
     * @param {{ question: string, subjectId: number, level: number }} params
     */
    async askQuestion({ question, subjectId, level }) {
        if (!question?.trim()) this.throwError('La pregunta no puede estar vacía.')
        if (question.length > 500) this.throwError('La pregunta es demasiado larga (máx 500 caracteres).')

        const subject = SUBJECTS_BY_ID[subjectId]
        if (!subject) this.throwNotFound('Materia')

        // 1. Generar chunks + embeddings (solo la primera vez, luego va del cache)
        await this._ensureChunks(subjectId, subject.content)

        // 2. Convertir la pregunta en vector
        const qVec = await this._embed(question.trim())

        // 3. Buscar los 3 fragmentos más similares
        const top = _chunkCache[subjectId]
            .map(c => ({ text: c.text, score: this._cosine(qVec, c.vec) }))
            .sort((a, b) => b.score - a.score)
            .slice(0, 3)
            .filter(c => c.score > 0.1)

        if (top.length === 0) {
            return {
                answer: `Hmm 🤔 esa pregunta no parece estar en el contenido de **${subject.name}**. ¿Me puedes preguntar algo sobre los temas de esta materia? 😊`,
            }
        }

        // 4. Llamar al LLM con el contexto recuperado
        const context = top.map(c => c.text).join('\n\n---\n\n')
        const answer = await this._callLLM(question.trim(), context, subject.name, level)
        return { answer }
    }

    // ── RAG helpers privados ──────────────────────────────────────────────────

    async _ensureChunks(subjectId, content) {
        if (_chunkCache[subjectId]) return
        console.log(`🔄 Generando embeddings para materia ${subjectId}...`)
        const chunks = this._splitText(content)
        const result = []
        for (const text of chunks) {
            result.push({ text, vec: await this._embed(text) })
        }
        _chunkCache[subjectId] = result
        console.log(`   ✅ ${result.length} fragmentos listos`)
    }

    _splitText(text, maxLen = 500, overlap = 80) {
        const paras = text.split(/\n{2,}/).map(p => p.trim()).filter(p => p.length > 20)
        const out = []
        let cur = ''
        for (const p of paras) {
            if (cur.length + p.length + 2 <= maxLen) {
                cur += (cur ? '\n\n' : '') + p
            } else {
                if (cur) { out.push(cur); cur = cur.slice(-overlap) + '\n\n' + p }
                else cur = p
            }
        }
        if (cur) out.push(cur)
        return out.filter(c => c.length > 20)
    }

    async _embed(text) {
        const model = await getEmbedder()
        const output = await model(text, { pooling: 'mean', normalize: true })
        return Array.from(output.data)
    }

    _cosine(a, b) {
        let dot = 0, na = 0, nb = 0
        for (let i = 0; i < a.length; i++) { dot += a[i] * b[i]; na += a[i] * a[i]; nb += b[i] * b[i] }
        return (na === 0 || nb === 0) ? 0 : dot / (Math.sqrt(na) * Math.sqrt(nb))
    }

    async _callLLM(question, context, subjectName, level) {
        const grade = level === 1 ? 'grados 1° y 2°' : level === 2 ? 'grados 3° y 4°' : 'grado 5°'

        const completion = await getGroq().chat.completions.create({
            model: 'llama-3.1-8b-instant',
            max_tokens: 250,
            temperature: 0.3,
            messages: [
                {
                    role: 'system',
                    content:
                        `Eres un asistente educativo amigable para estudiantes de ${grade} de primaria en Colombia. ` +
                        `Tu especialidad es ${subjectName}.\n` +
                        `REGLAS: 1) Responde SOLO con base en el texto dado. ` +
                        `2) Si la pregunta no está en el texto, díselo amablemente. ` +
                        `3) Lenguaje simple para niños. 4) Máximo 120 palabras. ` +
                        `5) Usa emojis ocasionalmente. 6) Español colombiano.`,
                },
                {
                    role: 'user',
                    content: `Texto de ${subjectName}:\n---\n${context}\n---\n\nPregunta: ${question}`,
                },
            ],
        })

        return (
            completion.choices[0]?.message?.content ||
            'No pude responder ahora. ¿Intentas de nuevo? 😊'
        )
    }
}