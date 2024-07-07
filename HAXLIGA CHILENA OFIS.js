var room = HBInit({
    roomName: "HXC",
    maxPlayers: 16,
    noPlayer: true,
    public: true
});

var autoTeamBalanceEnabled = true;

room.setDefaultStadium("Big");
room.setScoreLimit(5);
room.setTimeLimit(10);

function sendRandomAnnouncement(options, color) {
    var randomOption = options[Math.floor(Math.random() * options.length)];
    room.sendAnnouncement(randomOption, null, color, "bold", 1);
}

function toggleAutoTeamBalance() {
    autoTeamBalanceEnabled = !autoTeamBalanceEnabled;
    var status = autoTeamBalanceEnabled ? "Activado" : "Desactivado";
    room.sendAnnouncement(`Balance automático de equipos: ${status}`, null, 0x8A2BE2, "bold", 1);
}

function swapTeams() {
    room.getPlayerList().forEach(player => {
        var newTeam = player.team === 1 ? 2 : 1;
        room.setPlayerTeam(player.id, newTeam);
    });
}

function sendDiscordLink() {
    room.sendAnnouncement("¡Únete a nuestro Discord! https://discord.gg/s7YfJ8Ft", null, 0x7289da, "bold", 1);
}

setInterval(sendDiscordLink, 120000);

room.onPlayerJoin = function(player) {
    if (room.getPlayerList().length === 1) {
        room.setPlayerAdmin(player.id, true);
        room.sendAnnouncement(`¡${player.name} ahora es administrador!`, null, 0xFF0000);
    }
    room.sendAnnouncement(`¡Bienvenido a HXC ${player.name}!`, player.id, 0x6FF32D, "bold", 2);
    
    if (autoTeamBalanceEnabled) {
        assignAutoTeam(player);
    }
};

function assignAutoTeam(player) {
    var team = room.getPlayerList().filter(p => p.team !== null).length % 2 === 0 ? 1 : 2;
    room.setPlayerTeam(player.id, team);
}

room.onPlayerLeave = function(player) {};

room.onPlayerChat = function(player, message) {
    if (message.startsWith("!")) {
        var command = message.substring(1);
        switch (command) {
            case "help":
                room.sendAnnouncement("Lista de comandos disponibles: !help, !ole, !gol, !bicho", player.id, 0x00FF00, "bold", 1);
                break;
            case "ole":
                sendRandomAnnouncement(["OLEEEEEEE!", "¡Oleeeeeeeeee!", "¡Oleeeeeeeeeee!"], 0xFFD700);
                break;
            case "gol":
                sendRandomAnnouncement(["MAMITA QUE GOLAZO!", "Denle el Puskas!", "No papá, así no era..."], 0xFFA500);
                break;
            case "bicho":
                room.sendAnnouncement("SIUUUUUUUUUUU", null, 0x00FFFF, "bold", 1);
                break;
            case "toggleautoteam":
                toggleAutoTeamBalance();
                break;
            case "intercambiar":
                swapTeams();
                room.sendAnnouncement("Equipos intercambiados", null, 0x0000FF, "bold");
                break;
            default:
                room.sendAnnouncement(`Comando desconocido: ${command}.`, player.id, 0xFF0000, "bold", 2);
                return;
        }
        return false;
    } else {
        room.sendChat(message, player.id);
    }
};
