import { connectToServer } from "./socket-client";
import "./style.css";

document.querySelector<HTMLDivElement>("#app")!.innerHTML = `
  <div class="app">

    <!-- SIDEBAR -->
    <aside class="sidebar">

      <div class="logo">
        <div class="logo-mark">
          <span></span>
          <span></span>
        </div>

        <div class="logo-text">
          <strong>SOCKET</strong>
          <span>CLIENT</span>
        </div>
      </div>

      <div class="sidebar-content">

        <div class="workspace-label">
          WORKSPACE
        </div>

        <div class="nav-item active">
          <div class="nav-icon">◈</div>
          <span>WebSocket</span>
        </div>

        <div class="nav-item">
          <div class="nav-icon">＋</div>
          <span>New connection</span>
        </div>

        <div class="workspace-label recent">
          RECENT
        </div>

        <div class="recent-item">
          <span class="recent-dot"></span>
          Echo Server
        </div>

        <div class="recent-item">
          <span class="recent-dot"></span>
          Local API
        </div>

      </div>

      <div class="sidebar-footer">

        <div class="profile">
          <div class="avatar">J</div>

          <div class="profile-info">
            <strong>Developer</strong>
            <span>Personal workspace</span>
          </div>

          <span class="dots">•••</span>
        </div>

      </div>

    </aside>


    <!-- MAIN -->
    <main class="main">

      <!-- HEADER -->
      <header class="header">

        <div class="breadcrumb">
          <span>Workspace</span>
          <span class="slash">/</span>
          <strong>WebSocket</strong>
        </div>

        <div class="header-actions">

          <button class="ghost-button">
            <span>⌘</span>
            Search
          </button>

          <button class="icon-button">
            ⚙
          </button>

        </div>

      </header>


      <!-- CONTENT -->
      <div class="content">

        <!-- PAGE INTRO -->
        <section class="intro">

          <div class="intro-left">

            <div class="connection-status" id="server-status">
              <span class="status-indicator"></span>
              
            </div>

            <h1>WebSocket Client</h1>

            <p>
              Connect, inspect and interact with real-time
              WebSocket connections.
            </p>

          </div>

          <div class="intro-decoration">
            <div class="orb"></div>
            <div class="orb-line"></div>
          </div>

        </section>


        <!-- CONNECTION -->
        <section class="connection-card">

          <div class="card-header">

            <div>
              <span class="card-eyebrow">CONNECTION</span>

              <h2>Endpoint</h2>
            </div>

            <div class="connection-pill">
              <span></span>
              Disconnected
            </div>

          </div>


          <div class="url-row">

            <div class="protocol">
              <span class="protocol-dot"></span>
              WSS
            </div>

            <div class="url">
              wss://echo.websocket.events
            </div>

            <button class="connect-button">
              Connect
              <span>↗</span>
            </button>

          </div>


          <div class="connection-meta">

            <div class="meta-item">
              <span>Protocol</span>
              <strong>WebSocket</strong>
            </div>

            <div class="meta-item">
              <span>Security</span>
              <strong class="secure">Encrypted</strong>
            </div>

            <div class="meta-item">
              <span>Transport</span>
              <strong>WSS</strong>
            </div>

          </div>

        </section>


        <!-- MAIN GRID -->
        <div class="grid">


          <!-- LEFT -->
          <section class="panel messages-panel">

            <div class="panel-header">

              <div>
                <span class="panel-eyebrow">
                  ACTIVITY
                </span>

                <h3>Messages</h3>
              </div>

              <div class="message-count">
                0 messages
              </div>

            </div>


            <div class="empty-state">

              <div class="empty-visual">

                <div class="empty-ring ring-one"></div>
                <div class="empty-ring ring-two"></div>

                <div class="socket-symbol">
                  <span></span>
                  <span></span>
                  <span></span>
                </div>

              </div>

              <h4>No messages yet</h4>

              <p>
                Messages sent and received through the
                connection will appear here.
              </p>

            </div>


            <div class="message-composer">

              <div class="composer-top">

                <div class="composer-label">
                  MESSAGE
                </div>

                <div class="format-selector">
                  <span class="selected">TEXT</span>
                  <span>JSON</span>
                </div>

              </div>


              <div class="textarea">
                <span>Write a message...</span>
              </div>


              <div class="composer-bottom">

                <div class="shortcut">
                  <kbd>⌘</kbd>
                  <kbd>Enter</kbd>
                  <span>to send</span>
                </div>

                <button class="send-button">
                  Send message
                  <span>→</span>
                </button>

              </div>

            </div>

          </section>


          <!-- RIGHT -->
          <aside class="right-column">


            <!-- STATS -->
            <section class="panel stats-panel">

              <div class="panel-header small">

                <div>
                  <span class="panel-eyebrow">
                    OVERVIEW
                  </span>

                  <h3>Connection</h3>
                </div>

                <div class="live-dot"></div>

              </div>


              <div class="stats">

                <div class="stat">
                  <span>Status</span>
                  <strong>Offline</strong>
                </div>

                <div class="stat">
                  <span>Messages</span>
                  <strong>0</strong>
                </div>

                <div class="stat">
                  <span>Latency</span>
                  <strong>—</strong>
                </div>

                <div class="stat">
                  <span>Uptime</span>
                  <strong>—</strong>
                </div>

              </div>

            </section>


            <!-- REQUEST -->
            <section class="panel details-panel">

              <div class="panel-header small">

                <div>
                  <span class="panel-eyebrow">
                    CONFIGURATION
                  </span>

                  <h3>Request</h3>
                </div>

              </div>


              <div class="detail-row">

                <div class="detail-icon">◎</div>

                <div>
                  <span>Headers</span>
                  <strong>0 configured</strong>
                </div>

              </div>


              <div class="detail-row">

                <div class="detail-icon">⌁</div>

                <div>
                  <span>Query parameters</span>
                  <strong>0 configured</strong>
                </div>

              </div>


              <div class="detail-row">

                <div class="detail-icon">◇</div>

                <div>
                  <span>Authentication</span>
                  <strong>None</strong>
                </div>

              </div>

            </section>


            <!-- SERVER -->
            <section class="server-card">

              <div class="server-glow"></div>

              <span class="server-label">
                SERVER
              </span>

              <div class="server-status">
                <span></span>
                Waiting for connection
              </div>

              <div class="server-address">
                echo.websocket.events
              </div>

            </section>

          </aside>

        </div>

      </div>

    </main>

  </div>
`;

connectToServer();
