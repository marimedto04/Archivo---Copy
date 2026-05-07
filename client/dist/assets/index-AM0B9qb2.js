(function(){const e=document.createElement("link").relList;if(e&&e.supports&&e.supports("modulepreload"))return;for(const i of document.querySelectorAll('link[rel="modulepreload"]'))s(i);new MutationObserver(i=>{for(const n of i)if(n.type==="childList")for(const o of n.addedNodes)o.tagName==="LINK"&&o.rel==="modulepreload"&&s(o)}).observe(document,{childList:!0,subtree:!0});function t(i){const n={};return i.integrity&&(n.integrity=i.integrity),i.referrerPolicy&&(n.referrerPolicy=i.referrerPolicy),i.crossOrigin==="use-credentials"?n.credentials="include":i.crossOrigin==="anonymous"?n.credentials="omit":n.credentials="same-origin",n}function s(i){if(i.ep)return;i.ep=!0;const n=t(i);fetch(i.href,n)}})();class L{constructor(){this._baseUrl="",this._defaultHeaders={"Content-Type":"application/json"},this._interceptors={request:[],response:[]}}setBaseUrl(e){this._baseUrl=e}setHeader(e,t){this._defaultHeaders[e]=t}removeHeader(e){delete this._defaultHeaders[e]}setAuthToken(e){this.setHeader("Authorization",`Bearer ${e}`)}clearAuthToken(){this.removeHeader("Authorization")}addInterceptor(e,t){this._interceptors[e].push(t)}get(e,t={}){return this._request(e,{...t,method:"GET"})}post(e,t,s={}){return this._request(e,{...s,method:"POST",body:JSON.stringify(t)})}put(e,t,s={}){return this._request(e,{...s,method:"PUT",body:JSON.stringify(t)})}patch(e,t,s={}){return this._request(e,{...s,method:"PATCH",body:JSON.stringify(t)})}delete(e,t={}){return this._request(e,{...t,method:"DELETE"})}async _request(e,t={}){let s={...t,headers:{...this._defaultHeaders,...t.headers||{}}};for(const c of this._interceptors.request)s=await c(s);const i=`${this._baseUrl}${e}`;let n;try{n=await fetch(i,s)}catch(c){throw new Error(`Error de red: ${c.message}`)}for(const c of this._interceptors.response)n=await c(n);if(!n.ok){const c=await n.json().catch(()=>({})),_=new Error(c.message||`HTTP ${n.status}`);throw _.status=n.status,_.body=c,_}return(n.headers.get("content-type")||"").includes("application/json")?n.json():n.text()}}const l=new L;class f{constructor(e={}){this._data={},this._listeners={},this._init(e)}_init(e){const t=this.defaults();Object.assign(this._data,t,e)}defaults(){return{}}get(e){return this._data[e]}set(e,t){typeof e=="object"?Object.entries(e).forEach(([s,i])=>{this._data[s]=i,this._notify(s,i)}):(this._data[e]=t,this._notify(e,t))}validate(){return{valid:!0,errors:[]}}toJSON(){return{...this._data}}fromJSON(e){this.set(e)}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}off(e,t){this._listeners[e]&&(this._listeners[e]=this._listeners[e].filter(s=>s!==t))}_notify(e,t){(this._listeners[e]||[]).forEach(n=>n(t,e)),(this._listeners["*"]||[]).forEach(n=>n(t,e))}}class x extends f{defaults(){return{id:null,email:"",name:"",character:"pollo",grade:null,role:"guest",isAuthenticated:!1,createdAt:null}}validate(){const e=[];return(!this.get("email")||!this._isValidEmail(this.get("email")))&&e.push("El email no es válido."),(!this.get("name")||this.get("name").trim().length<2)&&e.push("El nombre debe tener al menos 2 caracteres."),{valid:e.length===0,errors:e}}get fullInfo(){return`${this.get("name")} <${this.get("email")}>`}get isAdmin(){return this.get("role")==="admin"}_isValidEmail(e){return/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(e)}}class A{constructor(){this._user=new x,this._token=null,this._listeners=[]}get user(){return this._user}get token(){return this._token}get isAuthenticated(){return this._user.get("isAuthenticated")&&this._token!==null}setSession(e){this._token=e.token,this._user.fromJSON({...e.user,isAuthenticated:!0}),this._persist(),this._notifyListeners()}clearSession(){this._token=null,this._user=new x,this._clearPersisted(),this._notifyListeners()}restore(){try{const e=localStorage.getItem("auth_session");if(!e)return;const t=JSON.parse(e);this.setSession(t)}catch{this.clearSession()}}_persist(){localStorage.setItem("auth_session",JSON.stringify({token:this._token,user:this._user.toJSON()}))}_clearPersisted(){localStorage.removeItem("auth_session")}subscribe(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(t=>t!==e)}}_notifyListeners(){this._listeners.forEach(e=>e({isAuthenticated:this.isAuthenticated,user:this._user.toJSON()}))}}const u=new A;class j{constructor(){this._events={}}on(e,t){return this._events[e]||(this._events[e]=[]),this._events[e].push(t),()=>this.off(e,t)}once(e,t){const s=(...i)=>{t(...i),this.off(e,s)};this.on(e,s)}off(e,t){this._events[e]&&(this._events[e]=this._events[e].filter(s=>s!==t))}emit(e,t){(this._events[e]||[]).forEach(i=>i(t))}clear(e){delete this._events[e]}clearAll(){this._events={}}}const r=new j;class N{async login(e){return l.post("/auth/login",e)}async register(e){return l.post("/auth/register",e)}async logout(){return l.post("/auth/logout",{})}async requestPasswordReset(e){return l.post("/auth/password-reset",{email:e})}async updateProfile(e){return l.put("/auth/profile",e)}async validateToken(){return l.get("/auth/validate")}}const b=new N;class p{constructor(e={}){this._viewModel=e.viewModel||null,this._container=this._resolveContainer(e.container),this._eventHandlers=[],this._vmSubscriptions=[],this._isMounted=!1}_resolveContainer(e){return typeof e=="string"?document.querySelector(e):e||null}async mount(){if(!this._container){console.error(`[BaseView] No se encontró el contenedor para ${this.constructor.name}`);return}this._container.innerHTML=this.render(),this._bindViewModel(),this._bindEvents(),this._isMounted=!0,this._viewModel&&await this._viewModel.onMount()}destroy(){this._eventHandlers.forEach(({element:e,event:t,handler:s})=>{e.removeEventListener(t,s)}),this._vmSubscriptions.forEach(({key:e,handler:t})=>{this._viewModel&&this._viewModel.off(e,t)}),this._viewModel&&this._viewModel.onDestroy(),this._eventHandlers=[],this._vmSubscriptions=[],this._isMounted=!1}render(){return""}updatePartial(e,t){const s=this._container.querySelector(e);s&&(s.innerHTML=t)}_bindViewModel(){}_subscribe(e,t){this._viewModel&&(this._viewModel.on(e,t),this._vmSubscriptions.push({key:e,handler:t}))}_bindEvents(){}_addEvent(e,t,s){let i;if(typeof e=="string"?i=this._container.querySelector(e):i=e,!i){console.warn(`[BaseView] No se encontró el elemento: ${e}`);return}i.addEventListener(t,s),this._eventHandlers.push({element:i,event:t,handler:s})}$(e){return this._container?this._container.querySelector(e):null}$$(e){return this._container?this._container.querySelectorAll(e):[]}}class g{constructor(e={}){this._state={},this._listeners={},this._model=e.model||null,this._isLoading=!1,this._error=null,this._initState()}_initState(){this.setState({isLoading:!1,error:null})}getState(e){return this._state[e]}setState(e){const t={...this._state};Object.assign(this._state,e),Object.keys(e).forEach(s=>{t[s]!==this._state[s]&&this._notify(s,this._state[s])}),this._notify("*",this._state)}startLoading(){this.setState({isLoading:!0,error:null})}stopLoading(){this.setState({isLoading:!1})}setError(e){const t=e instanceof Error?e.message:e;this.setState({isLoading:!1,error:t})}clearError(){this.setState({error:null})}async onMount(){}onDestroy(){this._listeners={}}on(e,t){this._listeners[e]||(this._listeners[e]=[]),this._listeners[e].push(t)}off(e,t){this._listeners[e]&&(this._listeners[e]=this._listeners[e].filter(s=>s!==t))}_notify(e,t){(this._listeners[e]||[]).forEach(i=>i(t))}}class D extends g{_initState(){this.setState({isLoading:!1,error:null,email:"",password:"",fieldErrors:{}})}updateField(e,t){this.setState({[e]:t});const s={...this.getState("fieldErrors")};delete s[e],this.setState({fieldErrors:s})}async submitLogin(){if(this._validateForm()){this.startLoading();try{const e={email:this.getState("email"),password:this.getState("password")},t=await b.login(e);u.setSession(t),l.setAuthToken(t.token),this.stopLoading(),r.emit("auth:loginSuccess",{user:t.user})}catch(e){this.setError(e.message||"Credenciales incorrectas.")}}}_validateForm(){const e={},t=this.getState("email"),s=this.getState("password");return(!t||!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(t))&&(e.email="Ingresa un email válido."),(!s||s.length<6)&&(e.password="La contraseña debe tener al menos 6 caracteres."),Object.keys(e).length>0?(this.setState({fieldErrors:e}),!1):!0}}class k extends p{constructor(e={}){const t=e.viewModel||new D;super({...e,viewModel:t})}render(){return`
      <div class="login-container">
        <div class="login-card">
          <h1 class="login-title">Iniciar sesión</h1>

          <div id="login-error" class="alert alert--error" style="display:none;"></div>

          <form id="login-form" novalidate>
            <div class="form-group">
              <label class="form-label" for="email">Email</label>
              <input
                class="form-input"
                type="email"
                id="email"
                name="email"
                placeholder="tu@email.com"
                autocomplete="email"
              />
              <span class="form-error" id="email-error"></span>
            </div>

            <div class="form-group">
              <label class="form-label" for="password">Contraseña</label>
              <input
                class="form-input"
                type="password"
                id="password"
                name="password"
                placeholder="••••••••"
                autocomplete="current-password"
              />
              <span class="form-error" id="password-error"></span>
            </div>

            <button
              class="btn btn--primary btn--full"
              type="submit"
              id="login-submit"
            >
              Ingresar
            </button>
          </form>
        </div>
      </div>
    `}_bindViewModel(){this._subscribe("isLoading",e=>{const t=this.$("#login-submit");t&&(t.disabled=e,t.textContent=e?"Ingresando...":"Ingresar")}),this._subscribe("error",e=>{const t=this.$("#login-error");t&&(e?(t.textContent=e,t.style.display="block"):t.style.display="none")}),this._subscribe("fieldErrors",e=>{this._renderFieldErrors(e)})}_bindEvents(){this._addEvent("#email","input",e=>{this._viewModel.updateField("email",e.target.value)}),this._addEvent("#password","input",e=>{this._viewModel.updateField("password",e.target.value)}),this._addEvent("#login-form","submit",async e=>{e.preventDefault(),await this._viewModel.submitLogin()})}_renderFieldErrors(e={}){["email","password"].forEach(s=>{const i=this.$(`#${s}-error`),n=this.$(`#${s}`);if(!i||!n)return;const o=e[s]||"";i.textContent=o,n.classList.toggle("form-input--error",!!o)})}}class P{async fetchDashboardData(){return l.get("/dashboard")}async fetchMetric(e){return l.get(`/dashboard/metrics/${e}`)}}const O=new P;class H extends f{defaults(){return{title:"Dashboard",metrics:[],lastUpdated:null}}validate(){const e=[];return Array.isArray(this.get("metrics"))||e.push("Las métricas deben ser un arreglo."),{valid:e.length===0,errors:e}}get metricsCount(){return(this.get("metrics")||[]).length}}class T{constructor(){this._dashboard=new H,this._listeners=[]}get dashboard(){return this._dashboard}updateData(e){this._dashboard.set(e),this._notifyListeners()}subscribe(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(t=>t!==e)}}_notifyListeners(){this._listeners.forEach(e=>e(this._dashboard.toJSON()))}}const q=new T;class V extends g{_initState(){this.setState({isLoading:!1,error:null,metrics:[],title:"Dashboard",lastUpdated:null,currentUser:null})}async onMount(){const e=u.user.toJSON();this.setState({currentUser:e}),this._logoutUnsub=r.on("auth:logout",()=>{this.setState({metrics:[],currentUser:null})}),await this.loadData()}onDestroy(){this._logoutUnsub&&this._logoutUnsub(),super.onDestroy()}async loadData(){this.startLoading();try{const e=await O.fetchDashboardData();q.updateData(e),this.setState({metrics:e.metrics,lastUpdated:e.lastUpdated,isLoading:!1})}catch(e){this.setError(e.message)}}async refresh(){await this.loadData()}}const I="data:image/png;base64,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",S=()=>`
  <nav class="home-nav">
      <img src="${I}" alt="Numi" class="logo-img">
      <div class="nav-links">
          <a href="/" data-link>Inicio</a>
          <a href="/dashboard" data-link>¿Qué es numi?</a>
          <a href="/download" data-link>Descargar</a>
          <a href="/dashboard" data-link>Mi numi</a>
      </div>
  </nav>
`,U=()=>`
  <section class="hero">
      <h1>numi, aprendizaje infantil sin límites y sin internet</h1>
      <p>Numi es una aplicación educativa infantil que ofrece actividades y experiencias de aprendizaje adaptadas a
          las necesidades de los niños. Su principal valor está en que funciona sin conexión a internet, lo que la
          convierte en una herramienta útil para contextos donde el acceso digital es limitado. Más que una app, Numi
          es una alternativa para aprender de forma autónoma, dinámica y accesible.</p>
      <div class="btn">Conoce numi</div>
      <div class="hero-wave">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path fill="#ffffff" fill-opacity="1"
                  d="M0,60L80,72C160,84,320,108,480,102.7C640,97,800,63,960,56.3C1120,49,1280,69,1360,78.7L1440,88L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z">
              </path>
          </svg>
      </div>
  </section>
`,B=()=>`
  <section class="welcome">
      <div class="welcome-text">
          <h2>Bienvenidos a numi</h2>
          <p>Bienvenido a Numi, un espacio donde aprender se convierte en una experiencia cercana, entretenida y
              accesible. Nuestra aplicación fue creada para apoyar a los niños en su formación a través de contenidos
              interactivos que pueden usarse sin internet, permitiendo que el aprendizaje llegue a más lugares y
              acompañe a cada niño en cualquier momento.</p>
      </div>
      <div class="welcome-img">
          <img src="assets/img/bienvenidos-1.PNG">
      </div>
  </section>
`,z=()=>`
  <section class="classes">
      <h2>Las clases que incluye</h2>
      <div class="class-grid">
          <div class="class-card">
              <div class="class-icon bg-math">
                  <span style="font-size: 40px; color: white;">123</span>
              </div>
              <span class="text-math">Matemáticas</span>
          </div>
          <div class="class-card">
              <div class="class-icon bg-social">
                  <span style="font-size: 40px; color: white;">🌍</span>
              </div>
              <span class="text-social">Ciencias<br>Sociales</span>
          </div>
          <div class="class-card">
              <div class="class-icon bg-nature">
                  <span style="font-size: 40px; color: white;">🌱</span>
              </div>
              <span class="text-nature">Ciencias<br>Naturales</span>
          </div>
          <div class="class-card">
              <div class="class-icon bg-english">
                  <span style="font-size: 40px; color: white;">ABC</span>
              </div>
              <span class="text-english">Inglés</span>
          </div>
          <div class="class-card">
              <div class="class-icon bg-spanish">
                  <span style="font-size: 40px; color: white;">📚</span>
              </div>
              <span class="text-spanish">Español</span>
          </div>
      </div>
  </section>
`,Q=()=>`
  <section class="benefits-container">
      <div class="benefits-decorations">
          <img src="assets/img/pollo.png" class="pollo" alt="Pollo">
          <img src="assets/img/nubes.png" class="nubes" alt="Nubes">
      </div>

      <h2>¿Qué beneficios tiene?</h2>
      <div class="benefits-grid">
          <div class="benefit-card">
              <div class="benefit-image">
                  <img src="assets/img/aprende sin internet.PNG">
              </div>
              <h3>Aprender sin internet</h3>
              <p>Nuestra plataforma permite a los niños disfrutar de contenidos interactivos sin necesidad de internet
                  en el dispositivo para que aprendan en su propio ritmo y momento.</p>
          </div>
          <div class="benefit-card">
              <div class="benefit-image">
                  <img src="assets/img/experiencias divertidas.PNG">
              </div>
              <h3>Experiencias divertidas</h3>
              <p>El aprendizaje lúdico y simple hace de Numi un lugar increíble para el aprendizaje, de este modo
                  garantizamos una dedicación óptima por parte de los niños.</p>
          </div>
          <div class="benefit-card">
              <div class="benefit-image">
                  <img src="assets/img/facil de usar.PNG">
              </div>
              <h3>Fácil de usar</h3>
              <p>Nuestra interfaz es muy fácil y amigable con el niño para facilitar su autonomía y proceso de
                  aprendizaje.</p>
          </div>
      </div>
  </section>
`,$=()=>`
  <section class="app-preview">
      <div class="phones">
          <div class="phone" style="background-image: linear-gradient(to bottom, #d232c8, #3763f4);"></div>
          <div class="phone" style="background-image: linear-gradient(to bottom, #f48c36, #ea605b);"></div>
      </div>
      <div class="app-text">
          <h2>Conoce a numi</h2>
          <p>Conoce cómo se ve Numi por dentro. A través de una interfaz amigable, colorida y fácil de entender, la
              aplicación ofrece a los niños un recorrido intuitivo por actividades, juegos e historias diseñados para
              aprender mientras exploran. Esta vista permite descubrir la experiencia de uso y entender cómo cada
              sección fue pensada para acompañar su proceso de forma simple y atractiva.</p>
      </div>
  </section>
`,X=()=>`
  <footer>
      <div class="footer-wave-top">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path
                  d="M0,60L80,48C160,36,320,12,480,17.3C640,23,800,57,960,64C1120,71,1280,51,1360,41.3L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z">
              </path>
          </svg>
      </div>

      <div class="footer-left">
          <img src="assets/img/logo-numi.png" alt="Numi" class="logo-img">
          <p>Numi es una aplicación educativa infantil que ofrece actividades y experiencias de aprendizaje adaptadas
              a las necesidades de los niños.</p>
      </div>

      <div class="footer-links">
          <a href="#">Inicio</a>
          <a href="#">¿Qué es numi?</a>
          <a href="#">Descargar</a>
          <a href="#">Mi numi</a>
      </div>

      <div class="footer-download">
          <svg viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Descargar app</span>
      </div>
  </footer>
`;class F extends p{constructor(e={}){const t=e.viewModel||new V;super({...e,viewModel:t})}render(){return`
      <div class="dashboard-container">
        ${S()}
        ${U()}
        ${B()}
        ${z()}
        ${Q()}
        ${$()}
        ${X()}
      </div>
    `}_bindViewModel(){}_bindEvents(){this._addEvent(".btn","click",e=>{e.preventDefault()})}}class R extends f{defaults(){return{}}validate(){return!0}}class G extends g{constructor(e={}){const t=e.model||new R;super({...e,model:t})}_initState(){super._initState()}}const Y=()=>`
    <section class="hero-download">
        <img src="assets/img/mono.png" class="hero-monkey" alt="Mono animado">

        <h1>Descarga la app en tu móvil</h1>
        <p class="hero-desc">
            Lleva Numi contigo y accede a una experiencia de aprendizaje diseñada para niños, con actividades, juegos o
            historias que funcionan sin internet. Aprende en cualquier momento y lugar.
        </p>

        <div class="download-box">
            <div class="btn-download" id="hero-btn-download">
                <svg viewBox="0 0 24 24">
                    <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                    <polyline points="7 10 12 15 17 10"></polyline>
                    <line x1="12" y1="15" x2="12" y2="3"></line>
                </svg>
            </div>
            <span class="download-label">Para android y IOS</span>
        </div>

        <div class="hero-nubes">
            <img src="assets/img/nubes.png" alt="Nubes decorativas">
        </div>
    </section>
`,J=()=>`
    <!-- Instrucciones -->
    <div class="section-header">
        <h2>¿Cómo descargar la app?</h2>
        <img src="assets/img/pollo.png" class="pollo-icon" alt="Pollo decorativo">
    </div>

    <details open>
        <summary>Descargarla desde la web</summary>
        <div class="details-body">
            <ol>
                <li>1. Abre www.numi.com en tu buscador Google o Safari</li>
                <li>2. Entra a la pestaña Descargar</li>
                <li>3. Presiona el botón <svg class="icon-inline" viewBox="0 0 24 24">
                        <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                        <polyline points="7 10 12 15 17 10"></polyline>
                        <line x1="12" y1="15" x2="12" y2="3"></line>
                    </svg></li>
                <li>4. Empieza a aprender</li>
            </ol>
        </div>
    </details>

    <details open>
        <summary>Descargarla desde Play Store o App Store</summary>
        <div class="details-body">
            <ol>
                <li>1. Entra a la Play Store o App Store</li>
                <li>2. En el buscador pon Numi</li>
                <li>3. Empieza a descargar la aplicación en tu móvil</li>
                <li>4. Ya estás listo para aprender</li>
            </ol>
        </div>
    </details>
`,K=()=>`
    <!-- Preguntas frecuentes -->
    <h2 class="faq-title">Preguntas frecuentes</h2>

    <details class="faq-card">
        <summary>¿Necesito internet para usar la app de Numi?</summary>
        <div class="details-body">
            <p>Nuestra aplicación está diseñada para funcionar de manera óptima sin conexión a internet una vez
                descargado el contenido.</p>
        </div>
    </details>

    <details class="faq-card">
        <summary>¿La aplicación es gratuita?</summary>
        <div class="details-body">
            <p>Sí, la descarga y las funciones principales son gratuitas.</p>
        </div>
    </details>

    <details class="faq-card">
        <summary>¿En que dispositivos funciona?</summary>
        <div class="details-body">
            <p>Funciona tanto en dispositivos Android como iOS, incluyendo tablets y móviles.</p>
        </div>
    </details>

    <details class="faq-card">
        <summary>¿Para que grados sirve Numi?</summary>
        <div class="details-body">
            <p>Está diseñado principalmente para niños y niñas en etapas preescolares y primeros años de primaria.</p>
        </div>
    </details>
`,Z=()=>`
    <footer>
        <div class="footer-wave" style="top: -60px;">
            <svg viewBox="0 0 1440 60" preserveAspectRatio="none">
                <path d="M0,30 C360,60 1080,0 1440,30 L1440,60 L0,60 Z"></path>
            </svg>
        </div>

        <img src="assets/img/mono.png" alt="Mono" class="footer-monkey">

        <div class="footer-left">
            <img src="assets/img/logo-numi.png" alt="Numi" class="logo-img">
            <p>Numi es una aplicación educativa infantil que ofrece actividades y experiencias de aprendizaje adaptadas
                a las necesidades de los niños.</p>
        </div>

        <div class="footer-links">
            <a href="#" class="nav-link-inicio">Inicio</a>
            <a href="#">¿Qué es numi?</a>
            <a href="#" class="nav-link-descargar">Descargar</a>
            <a href="#">Mi numi</a>
        </div>

        <div class="footer-download">
            <svg viewBox="0 0 24 24">
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
                <polyline points="7 10 12 15 17 10"></polyline>
                <line x1="12" y1="15" x2="12" y2="3"></line>
            </svg>
            <span>Descargar app</span>
        </div>
    </footer>
`;class W extends p{constructor(e={}){const t=e.viewModel||new G;super({...e,viewModel:t})}render(){return`
            <div class="download-module-container">
                ${S()}
                ${Y()}
                
                <div class="content-download">
                    ${J()}
                    ${K()}
                </div>

                ${Z()}
            </div>
        `}_bindViewModel(){}_bindEvents(){this._addEvent("#hero-btn-download","click",()=>{alert("¡Descarga iniciada de Numi!")})}}class ee extends f{defaults(){return{}}validate(){return!0}}class te extends g{constructor(e={}){const t=e.model||new ee;super({...e,model:t}),r.on("auth:loginError",s=>{this.setState({loginError:s,isLoginLoading:!1})}),r.on("auth:registerError",s=>{this.setState({registerError:s,isRegisterLoading:!1})}),r.on("auth:loginSuccess",()=>{this.setState({isLoginLoading:!1})}),r.on("auth:registerSuccess",()=>{this.setState({isRegisterLoading:!1})})}_initState(){super._initState(),this.setState({loginEmail:"",loginPassword:"",loginError:null,isLoginLoading:!1,registerEmail:"",registerPassword:"",registerName:"",registerCharacter:"",registerGrade:"",registerError:null,isRegisterLoading:!1})}updateField(e,t){this.setState({[e]:t}),e.startsWith("login")&&this.setState({loginError:null}),e.startsWith("register")&&this.setState({registerError:null})}submitLogin(){const e=this.getState("loginEmail"),t=this.getState("loginPassword");if(!e||!t)return this.setState({loginError:"Por favor completa todos los campos."});this.setState({isLoginLoading:!0,loginError:null}),r.emit("auth:requestLogin",{email:e,password:t})}submitRegister(){const e=this.getState("registerEmail"),t=this.getState("registerPassword"),s=this.getState("registerName"),i=this.getState("registerCharacter"),n=this.getState("registerGrade");if(!e||!t||!s||!i||!n)return this.setState({registerError:"Por favor completa todos los campos (incluyendo personaje y grado)."});if(t.length<6)return this.setState({registerError:"La contraseña debe tener al menos 6 caracteres."});this.setState({isRegisterLoading:!0,registerError:null}),r.emit("auth:requestRegister",{email:e,password:t,name:s,character:i,grade:n})}}const se="/assets/pollo1-5pJFQMwO.png",ie="/assets/mono-CD1FiYWz.png",ae=()=>`
  <footer>
      <div class="footer-wave-top">
          <svg viewBox="0 0 1440 120" preserveAspectRatio="none">
              <path
                  d="M0,60L80,48C160,36,320,12,480,17.3C640,23,800,57,960,64C1120,71,1280,51,1360,41.3L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z">
              </path>
          </svg>
      </div>

      <div class="footer-left">
          <img src="assets/img/logo-numi.png" alt="Numi" class="logo-img">
          <p>Numi es una aplicación educativa infantil que ofrece actividades y experiencias de aprendizaje adaptadas
              a las necesidades de los niños.</p>
      </div>

      <div class="footer-links">
          <a href="#">Inicio</a>
          <a href="#">¿Qué es numi?</a>
          <a href="#">Descargar</a>
          <a href="#">Mi numi</a>
      </div>

      <div class="footer-download">
          <svg viewBox="0 0 24 24">
              <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4"></path>
              <polyline points="7 10 12 15 17 10"></polyline>
              <line x1="12" y1="15" x2="12" y2="3"></line>
          </svg>
          <span>Descargar app</span>
      </div>
  </footer>
`;class w extends p{constructor(e={}){const t=e.viewModel||new te;super({...e,viewModel:t})}render(){return`
      <div class="home-container" style="">
        ${S()}

        <header class="home-header">
            <h1>
                <span class="text-white">¡Hola!</span><br>
                Bienvenido a <span class="text-white">numi</span>
            </h1>
        </header>

        <section class="login-wrapper">
            <div class="wave-top">
                <svg viewBox="0 0 1440 120" preserveAspectRatio="none"><path fill="#ffffff" d="M0,32L80,37.3C160,43,320,53,480,53.3C640,53,800,43,960,37.3C1120,32,1280,32,1360,32L1440,32L1440,120L1360,120C1280,120,1120,120,960,120C800,120,640,120,480,120C320,120,160,120,80,120L0,120Z"></path></svg>
            </div>
            <div class="login-container">
                <h2>Inicia sesión</h2>
                <div id="login-error-msg" class="alert alert--error" style="display:none; color: red; margin-bottom: 10px;"></div>
                <form id="home-login-form">
                    <input type="email" id="login-email" placeholder="Email" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border); margin-bottom: 10px;">
                    <input type="password" id="login-password" placeholder="Contraseña" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border); margin-bottom: 10px;">
                    <button type="submit" class="btn-orange" id="btn-login" style="margin-top: 15px; width: 100%;">Iniciar sesión</button>
                </form>
            </div>
        </section>
        <section class="onda">
        </section>
      
        <section class="signup-wrapper">
            <h2>Crea una cuenta (Diseño Original Intacto)</h2>

            <h3>¿Cuál es tu nombre?</h3>
            <div class="input-center">
                <input id="register-name-fake" type="text" placeholder="Nombre" style="width: 100%; padding: 15px; border-radius: 5px; border: 1px solid var(--input-border);">
            </div>

            <h3>Elije tu personaje</h3>
            <div class="character-selection">
                <div class="char-circle bg-purple" data-character="pollo">
                    <img src="${se}" alt="Pollo">
                </div>
                <div class="char-circle bg-green" data-character="mono">
                    <img src="${ie}" alt="Mono">
                </div>
            </div>

            <h3>A que grado perteneces</h3>
            <div class="grade-selection">
                <button type="button" class="grade-btn bg-green" data-grade="3">3º</button>
                <button type="button" class="grade-btn bg-purple" data-grade="4">4º</button>
                <button type="button" class="grade-btn bg-red" data-grade="5">5º</button>
            </div>

            <button type="button" id="btn-register-fake" class="btn-orange" style="margin-top: 20px;">
              Crear cuenta
            </button>

            <div class="landscape"></div>
        </section>

        <!-- FORMULARIO PROVISIONAL DE REGISTRO REAL -->
        <section style="padding: 50px 20px; background: #fff; border-top: 2px solid #ccc;">
            <h2 style="color: #333; text-align: center;">CREAR CUENTA (PROVISIONAL - CONECTADO A BD)</h2>
            <div id="prov-register-error" class="alert alert--error" style="display:none; color: red; max-width: 400px; margin: 10px auto;"></div>
            <form id="prov-register-form" style="max-width: 400px; margin: 0 auto; display: flex; flex-direction: column; gap: 15px;">
                <input type="email" id="prov-reg-email" placeholder="Correo electrónico" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                <input type="password" id="prov-reg-password" placeholder="Contraseña (mínimo 6)" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                <input type="text" id="prov-reg-name" placeholder="Tu Nombre" required style="padding: 10px; border: 1px solid #ccc; border-radius: 5px;">
                
                <div>
                    <label style="display: block; margin-bottom: 5px;">Personaje:</label>
                    <select id="prov-reg-char" style="padding: 10px; width: 100%; border: 1px solid #ccc; border-radius: 5px;">
                        <option value="pollo">Pollo</option>
                        <option value="mono">Mono</option>
                    </select>
                </div>

                <div>
                    <label style="display: block; margin-bottom: 5px;">Nivel:</label>
                    <select id="prov-reg-grade" style="padding: 10px; width: 100%; border: 1px solid #ccc; border-radius: 5px;">
                        <option value="3">3º</option>
                        <option value="4">4º</option>
                        <option value="5">5º</option>
                    </select>
                </div>

                <button type="submit" id="btn-prov-register" style="padding: 15px; background: #FF9800; color: white; font-weight: bold; border: none; border-radius: 5px; cursor: pointer;">
                    Crear cuenta y guardar en BD
                </button>
            </form>
        </section>

        ${ae()}
      </div>
    `}_bindViewModel(){this._subscribe("loginError",e=>{const t=this.$("#login-error-msg");t&&(t.textContent=e||"",t.style.display=e?"block":"none")}),this._subscribe("registerError",e=>{const t=this.$("#prov-register-error");t&&(t.textContent=e||"",t.style.display=e?"block":"none")}),this._subscribe("isLoginLoading",e=>{const t=this.$("#btn-login");t&&(t.textContent=e?"Iniciando...":"Iniciar sesión")}),this._subscribe("isRegisterLoading",e=>{const t=this.$("#btn-prov-register");t&&(t.textContent=e?"Guardando...":"Crear cuenta y guardar en BD")})}_bindEvents(){this._addEvent("#login-email","input",e=>this._viewModel.updateField("loginEmail",e.target.value)),this._addEvent("#login-password","input",e=>this._viewModel.updateField("loginPassword",e.target.value)),this._addEvent("#home-login-form","submit",e=>{e.preventDefault(),this._viewModel.submitLogin()}),this._addEvent("#btn-register-fake","click",e=>{e.preventDefault(),alert("Por favor usa el formulario provisional al fondo de la página para crear cuenta.")}),this._addEvent(".char-circle","click",()=>{},!0),this._addEvent(".grade-btn","click",()=>{},!0),this._addEvent("#prov-reg-email","input",e=>this._viewModel.updateField("registerEmail",e.target.value)),this._addEvent("#prov-reg-password","input",e=>this._viewModel.updateField("registerPassword",e.target.value)),this._addEvent("#prov-reg-name","input",e=>this._viewModel.updateField("registerName",e.target.value)),this._addEvent("#prov-reg-char","change",e=>this._viewModel.updateField("registerCharacter",e.target.value)),this._addEvent("#prov-reg-grade","change",e=>this._viewModel.updateField("registerGrade",e.target.value)),this._addEvent("#prov-register-form","submit",e=>{e.preventDefault(),this._viewModel.getState("registerCharacter")||this._viewModel.updateField("registerCharacter","pollo"),this._viewModel.getState("registerGrade")||this._viewModel.updateField("registerGrade","3"),this._viewModel.submitRegister()})}}class ne{getSubjectsByLevel(e){return l.get(`/chatbot/subjects?level=${e}`)}downloadSubjectContent(e){return l.get(`/chatbot/subjects/${e}/content`)}askQuestion(e){return l.post("/chatbot/ask",e)}}const y=new ne,C="edural_chatbot_contents";class re{constructor(){this._contents=new Map,this._history=new Map,this._listeners=[],this._restore()}getContent(e){return this._contents.get(e)??null}getHistory(e){return this._history.get(e)??[]}isDownloaded(e){return this._contents.has(e)}saveContent(e,t){this._contents.set(e,t),this._persist(),this._notify()}addMessage(e,t){this._history.has(e)||this._history.set(e,[]),this._history.get(e).push(t),this._notify()}clearHistory(e){this._history.set(e,[]),this._notify()}subscribe(e){return this._listeners.push(e),()=>{this._listeners=this._listeners.filter(t=>t!==e)}}_persist(){try{const e={};this._contents.forEach((t,s)=>{e[s]=t}),localStorage.setItem(C,JSON.stringify(e))}catch{}}_restore(){try{const e=localStorage.getItem(C);if(!e)return;Object.entries(JSON.parse(e)).forEach(([t,s])=>this._contents.set(Number(t),s))}catch{}}_notify(){this._listeners.forEach(e=>e())}}const v=new re;class oe extends g{_initState(){this.setState({isLoading:!1,error:null,selectedLevel:null,subjects:[],downloadingId:null})}async selectLevel(e){var t;this.setState({selectedLevel:e,subjects:[],error:null}),this.startLoading();try{const s=await y.getSubjectsByLevel(e),n=(((t=s==null?void 0:s.data)==null?void 0:t.subjects)??(s==null?void 0:s.subjects)??[]).map(o=>({...o,isDownloaded:v.isDownloaded(o.id)}));this.setState({subjects:n,isLoading:!1})}catch(s){this.setError(s.message||"Error al cargar las materias.")}}async downloadContent(e){var t;this.setState({downloadingId:e});try{const s=await y.downloadSubjectContent(e),i=((t=s==null?void 0:s.data)==null?void 0:t.content)??(s==null?void 0:s.content);v.saveContent(e,i);const n=this.getState("subjects").map(o=>o.id===e?{...o,isDownloaded:!0}:o);this.setState({subjects:n,downloadingId:null})}catch(s){this.setState({downloadingId:null}),this.setError(s.message||"Error al descargar.")}}selectSubject(e){r.emit("chatbot:subjectSelected",{subject:e,level:this.getState("selectedLevel")})}}const le=[{level:1,label:"Nivel 1",grades:"Grados 1° y 2°",emoji:"🌱"},{level:2,label:"Nivel 2",grades:"Grados 3° y 4°",emoji:"⭐"},{level:3,label:"Nivel 3",grades:"Grado 5°",emoji:"🏆"}];class de extends p{constructor(e={}){super({...e,viewModel:e.viewModel||new oe})}render(){return`
      <div class="chatbot-selector">
        <div class="chatbot-selector__header">
          <h2 class="chatbot-selector__title">NUMI</h2>
          <p class="chatbot-selector__subtitle">Elige tu nivel y materia para empezar</p>
        </div>

        <div class="chatbot-selector__levels" id="level-buttons">
          ${le.map(e=>`
            <button class="chatbot-level-btn" data-level="${e.level}">
              <span class="chatbot-level-btn__emoji">${e.emoji}</span>
              <span class="chatbot-level-btn__label">${e.label}</span>
              <span class="chatbot-level-btn__grades">${e.grades}</span>
            </button>
          `).join("")}
        </div>

        <div id="sel-error"   class="alert alert--error" style="display:none;"></div>
        <div id="sel-loading" class="loading"            style="display:none;">Cargando materias...</div>
        <div id="sel-list"    class="chatbot-subjects"></div>
      </div>
    `}_bindViewModel(){this._subscribe("isLoading",e=>{const t=this.$("#sel-loading");t&&(t.style.display=e?"block":"none")}),this._subscribe("error",e=>{const t=this.$("#sel-error");t&&(t.textContent=e||"",t.style.display=e?"block":"none")}),this._subscribe("selectedLevel",e=>{this.$$(".chatbot-level-btn").forEach(t=>t.classList.toggle("chatbot-level-btn--active",Number(t.dataset.level)===e))}),this._subscribe("subjects",e=>this._renderList(e))}_bindEvents(){this._addEvent("#level-buttons","click",e=>{const t=e.target.closest("[data-level]");t&&this._viewModel.selectLevel(Number(t.dataset.level))}),this._addEvent("#sel-list","click",e=>{const t=e.target.closest("[data-download]"),s=e.target.closest("[data-chat]");if(t&&this._viewModel.downloadContent(Number(t.dataset.download)),s){const i=this._viewModel.getState("subjects").find(n=>n.id===Number(s.dataset.chat));i&&this._viewModel.selectSubject(i)}})}_renderList(e){const t=this.$("#sel-list");if(t){if(!(e!=null&&e.length)){t.innerHTML="";return}t.innerHTML=e.map(s=>`
      <div class="chatbot-subject-card" style="border-left:4px solid ${s.color||"#4CAF50"}">
        <div class="chatbot-subject-card__info">
          <div>
            <p class="chatbot-subject-card__name">${s.name}</p>
            <p class="chatbot-subject-card__desc">${s.description||""}</p>
          </div>
        </div>
        ${s.isDownloaded?'<span class="chatbot-subject-card__badge">✅ Descargado</span>':""}
        <div class="chatbot-subject-card__actions">
          <button class="btn btn--secondary chatbot-subject-card__btn-dl" data-download="${s.id}">
            ${s.isDownloaded?"🔄 Actualizar":"⬇️ Descargar"}
          </button>
          <button class="btn btn--primary chatbot-subject-card__btn-chat" data-chat="${s.id}"
            ${s.isDownloaded?"":'disabled title="Descarga primero"'}>
            🤖 Chatear
          </button>
        </div>
      </div>
    `).join("")}}}class ce extends g{constructor(e={}){super(e),this._subject=e.subject||null,this._level=e.level||null}_initState(){this.setState({isLoading:!1,error:null,messages:[],inputText:"",subject:null,isOnline:navigator.onLine})}async onMount(){if(!this._subject)return;this.setState({subject:this._subject});const e=v.getHistory(this._subject.id);e.length>0?this.setState({messages:[...e]}):this._push("assistant","¡Hola! Soy numi ¿en qué te puedo ayudar hoy?"),this._onOnline=()=>this.setState({isOnline:!0}),this._onOffline=()=>this.setState({isOnline:!1}),window.addEventListener("online",this._onOnline),window.addEventListener("offline",this._onOffline)}onDestroy(){window.removeEventListener("online",this._onOnline),window.removeEventListener("offline",this._onOffline),super.onDestroy()}updateInput(e){this.setState({inputText:e})}async sendMessage(){var t;const e=this.getState("inputText").trim();if(!(!e||this.getState("isLoading"))){this.setState({inputText:""}),this._push("user",e),this.startLoading();try{const s=await y.askQuestion({question:e,subjectId:this._subject.id,level:this._level}),i=((t=s==null?void 0:s.data)==null?void 0:t.answer)??(s==null?void 0:s.answer)??"Sin respuesta.";this._push("assistant",i)}catch(s){this._push("error",s.message||"¿Tienes conexión a internet? 📶")}finally{this.stopLoading()}}}goBack(){r.emit("chatbot:back")}clearChat(){v.clearHistory(this._subject.id),this.setState({messages:[]}),this._push("assistant",`Chat reiniciado. ¡Listo para responder sobre **${this._subject.name}**! 😊`)}_push(e,t){const s={id:Date.now()+Math.random(),role:e,text:t,timestamp:new Date().toISOString()},i=[...this.getState("messages"),s];this.setState({messages:i}),this._subject&&v.addMessage(this._subject.id,s)}}const M={espanol:["¿Qué son las vocales?","¿Qué es una oración?","¿Qué tipos de texto existen?"],matematicas:["¿Cómo se hace una suma?","¿Qué es una fracción?","¿Cómo calculo el perímetro?"],ciencias:["¿Qué son los cinco sentidos?","¿Qué es un ecosistema?","¿Cómo funciona el ciclo del agua?"],sociales:["¿Qué es la familia?","¿Cuáles son las regiones de Colombia?","¿Cuándo fue la independencia?"],ingles:["¿Cómo se dice hola en inglés?","¿Cuáles son los colores en inglés?","¿Cómo son los días de la semana?"]};class ue extends p{constructor(e={}){super({...e,viewModel:new ce({subject:e.subject,level:e.level})}),this._subject=e.subject}render(){const e=this._subject||{};return`
      <div class="chatbot-chat">
        <header class="chatbot-chat__header">
          <button id="btn-back"  class="chatbot-chat__back  btn btn--secondary">← Volver</button>
          <div class="chatbot-chat__subject-info">
            <div>
              <p class="chatbot-chat__subject-name">${e.name||"Materia"}</p>
              <p class="chatbot-chat__subject-level">IA Educativa</p>
            </div>
          </div>
          <div id="chat-status" class="chatbot-chat__status" style="color:#16a34a;">●</div>
          <button id="btn-clear" class="chatbot-chat__clear btn btn--secondary" title="Limpiar chat">🗑️</button>
        </header>

        <div id="offline-banner" class="chatbot-chat__offline" style="display:none;">
          📵 Sin internet — numi necesita conexión para responder
        </div>

        <div id="chat-msgs" class="chatbot-chat__messages"></div>

        <div id="chat-sugg" class="chatbot-chat__suggestions">
          <p class="chatbot-chat__suggestions-label">💡 Prueba preguntando:</p>
          <div id="sugg-grid" class="chatbot-chat__suggestions-grid"></div>
        </div>

        <div id="chat-typing" class="chatbot-chat__typing" style="display:none;">
          <span class="chatbot-chat__typing-avatar">🤖</span>
          <div class="chatbot-chat__typing-dots"><span></span><span></span><span></span></div>
        </div>

        <div class="chatbot-chat__input-area">
          <textarea
            id="chat-input" class="chatbot-chat__input form-input"
            placeholder="Pregúntame sobre ${e.name||"esta materia"}..."
            rows="1" autocomplete="off"
          ></textarea>
          <button id="btn-send" class="chatbot-chat__send btn btn--primary" disabled>➤</button>
        </div>
      </div>
    `}_bindViewModel(){this._subscribe("messages",e=>{this._renderMsgs(e);const t=e.some(i=>i.role==="user"),s=this.$("#chat-sugg");s&&(s.style.display=t?"none":"block")}),this._subscribe("isLoading",e=>{const t=this.$("#chat-typing"),s=this.$("#btn-send");t&&(t.style.display=e?"flex":"none"),s&&(s.disabled=e||!this._viewModel.getState("inputText").trim()),this._scrollDown()}),this._subscribe("inputText",e=>{const t=this.$("#btn-send");t&&(t.disabled=!e.trim()||this._viewModel.getState("isLoading"))}),this._subscribe("isOnline",e=>{const t=this.$("#offline-banner"),s=this.$("#chat-status");t&&(t.style.display=e?"none":"block"),s&&(s.style.color=e?"#16a34a":"#dc2626")}),this._renderSugg()}_bindEvents(){this._addEvent("#btn-back","click",()=>this._viewModel.goBack()),this._addEvent("#btn-clear","click",()=>{confirm("¿Limpiar el historial?")&&this._viewModel.clearChat()}),this._addEvent("#chat-input","input",e=>{this._viewModel.updateInput(e.target.value),e.target.style.height="auto",e.target.style.height=Math.min(e.target.scrollHeight,120)+"px"}),this._addEvent("#chat-input","keydown",e=>{e.key==="Enter"&&!e.shiftKey&&(e.preventDefault(),this._viewModel.sendMessage())}),this._addEvent("#btn-send","click",()=>this._viewModel.sendMessage()),this._addEvent("#sugg-grid","click",e=>{const t=e.target.closest("[data-s]");if(!t)return;this._viewModel.updateInput(t.dataset.s);const s=this.$("#chat-input");s&&(s.value=t.dataset.s,s.focus())})}_renderMsgs(e){const t=this.$("#chat-msgs");t&&(t.innerHTML=e.map(s=>{const i=s.role==="user",n=s.role==="error",o=i?"chatbot-chat__bubble--user":n?"chatbot-chat__bubble--error":"chatbot-chat__bubble--bot";return`
        <div class="chatbot-chat__message chatbot-chat__message--${s.role}">
          ${i?"":'<span class="chatbot-chat__avatar">🤖</span>'}
          <div class="chatbot-chat__bubble ${o}">${this._fmt(s.text)}</div>
          ${i?'<span class="chatbot-chat__avatar">🧒</span>':""}
        </div>`}).join(""),this._scrollDown())}_renderSugg(){const e=this.$("#sugg-grid");if(!e||!this._subject)return;const t=M[this._subject.slug]||M.espanol;e.innerHTML=t.map(s=>`<button class="chatbot-chat__suggestion-btn" data-s="${s}">${s}</button>`).join("")}_scrollDown(){const e=this.$("#chat-msgs");e&&setTimeout(()=>{e.scrollTop=e.scrollHeight},50)}_fmt(e){return e.replace(/&/g,"&amp;").replace(/</g,"&lt;").replace(/>/g,"&gt;").replace(/\*\*(.*?)\*\*/g,"<strong>$1</strong>").replace(/\n/g,"<br>")}}l.setBaseUrl("http://localhost:3000");u.restore();u.token&&l.setAuthToken(u.token);let m=null;const he="#app";async function h(a,e={}){m&&m.destroy(),m=new a({container:he,...e}),await m.mount()}function d(a,e={}){window.history.pushState(e,"",a),E()}function E(){switch(window.location.pathname){case"/":return h(w);case"/login":return h(k);case"/register":return h(w);case"/dashboard":return h(F);case"/download":return h(W);case"/chat-subjects":return h(de);case"/chat":const e=window.history.state||{};return h(ue,e);default:return h(w)}}window.addEventListener("popstate",E);document.body.addEventListener("click",a=>{a.target.matches("[data-link]")?(a.preventDefault(),d(a.target.getAttribute("href"))):a.target.closest("[data-link]")&&(a.preventDefault(),d(a.target.closest("[data-link]").getAttribute("href")))});window.addEventListener("DOMContentLoaded",()=>{window.location.pathname==="/"&&u.isAuthenticated?d("/dashboard"):E()});r.on("auth:requestLogin",async a=>{try{const e=await b.login(a);u.setSession(e),l.setAuthToken(e.token),r.emit("auth:loginSuccess")}catch(e){r.emit("auth:loginError",e.message)}});r.on("auth:requestRegister",async a=>{try{const{email:e,password:t,name:s,character:i,grade:n}=a,o=await b.register({email:e,password:t});u.setSession(o),l.setAuthToken(o.token);const c=await b.updateProfile({name:s,character:i,grade:parseInt(n,10)});u.setSession(c),r.emit("auth:registerSuccess")}catch(e){r.emit("auth:registerError",e.message)}});r.on("auth:loginSuccess",()=>d("/dashboard"));r.on("auth:registerSuccess",()=>d("/dashboard"));r.on("navigation:goToLogin",()=>d("/login"));r.on("auth:logout",()=>{u.clearSession(),l.clearAuthToken(),d("/")});r.on("navigation:goToHome",()=>d("/"));r.on("navigation:goToDownload",()=>d("/download"));r.on("navigation:openChatbot",()=>d("/chat-subjects"));r.on("chatbot:subjectSelected",({subject:a,level:e})=>d("/chat",{subject:a,level:e}));r.on("chatbot:back",()=>d("/chat-subjects"));
