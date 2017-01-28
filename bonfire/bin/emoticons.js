// Generated by CoffeeScript 1.12.0
(function() {
  define([], function() {
    var emoticons, genEmoticon, ourEmoticons, purgeEmoticon, purgeRegex, twitchEmoticons;
    twitchEmoticons = {
      "4Head": "https://static-cdn.jtvnw.net/emoticons/v1/354/1.0",
      "ANELE": "https://static-cdn.jtvnw.net/emoticons/v1/3792/1.0",
      "ArgieB8": "https://static-cdn.jtvnw.net/emoticons/v1/51838/1.0",
      "ArsonNoSexy": "https://static-cdn.jtvnw.net/emoticons/v1/50/1.0",
      "AsianGlow": "https://static-cdn.jtvnw.net/emoticons/v1/74/1.0",
      "AthenaPMS": "https://static-cdn.jtvnw.net/emoticons/v1/32035/1.0",
      "BabyRage": "https://static-cdn.jtvnw.net/emoticons/v1/22639/1.0",
      "BatChest": "https://static-cdn.jtvnw.net/emoticons/v1/1905/1.0",
      "BCouch": "https://static-cdn.jtvnw.net/emoticons/v1/83536/1.0",
      "BCWarrior": "https://static-cdn.jtvnw.net/emoticons/v1/30/1.0",
      "BibleThump": "https://static-cdn.jtvnw.net/emoticons/v1/86/1.0",
      "BigBrother": "https://static-cdn.jtvnw.net/emoticons/v1/1904/1.0",
      "BionicBunion": "https://static-cdn.jtvnw.net/emoticons/v1/24/1.0",
      "BlargNaut": "https://static-cdn.jtvnw.net/emoticons/v1/38/1.0",
      "bleedPurple": "https://static-cdn.jtvnw.net/emoticons/v1/62835/1.0",
      "BloodTrail": "https://static-cdn.jtvnw.net/emoticons/v1/69/1.0",
      "BORT": "https://static-cdn.jtvnw.net/emoticons/v1/243/1.0",
      "BrainSlug": "https://static-cdn.jtvnw.net/emoticons/v1/881/1.0",
      "BrokeBack": "https://static-cdn.jtvnw.net/emoticons/v1/4057/1.0",
      "BuddhaBar": "https://static-cdn.jtvnw.net/emoticons/v1/27602/1.0",
      "ChefFrank": "https://static-cdn.jtvnw.net/emoticons/v1/90129/1.0",
      "cmonBruh": "https://static-cdn.jtvnw.net/emoticons/v1/84608/1.0",
      "CoolCat": "https://static-cdn.jtvnw.net/emoticons/v1/58127/1.0",
      "CorgiDerp": "https://static-cdn.jtvnw.net/emoticons/v1/49106/1.0",
      "CougarHunt": "https://static-cdn.jtvnw.net/emoticons/v1/21/1.0",
      "DAESuppy": "https://static-cdn.jtvnw.net/emoticons/v1/973/1.0",
      "DansGame": "https://static-cdn.jtvnw.net/emoticons/v1/33/1.0",
      "DatSheffy": "https://static-cdn.jtvnw.net/emoticons/v1/170/1.0",
      "DBstyle": "https://static-cdn.jtvnw.net/emoticons/v1/73/1.0",
      "deExcite": "https://static-cdn.jtvnw.net/emoticons/v1/46249/1.0",
      "deIlluminati": "https://static-cdn.jtvnw.net/emoticons/v1/46248/1.0",
      "DendiFace": "https://static-cdn.jtvnw.net/emoticons/v1/58135/1.0",
      "DogFace": "https://static-cdn.jtvnw.net/emoticons/v1/1903/1.0",
      "DOOMGuy": "https://static-cdn.jtvnw.net/emoticons/v1/54089/1.0",
      "duDudu": "https://static-cdn.jtvnw.net/emoticons/v1/62834/1.0",
      "EagleEye": "https://static-cdn.jtvnw.net/emoticons/v1/20/1.0",
      "EleGiggle": "https://static-cdn.jtvnw.net/emoticons/v1/4339/1.0",
      "FailFish": "https://static-cdn.jtvnw.net/emoticons/v1/360/1.0",
      "FPSMarksman": "https://static-cdn.jtvnw.net/emoticons/v1/42/1.0",
      "FrankerZ": "https://static-cdn.jtvnw.net/emoticons/v1/65/1.0",
      "FreakinStinkin": "https://static-cdn.jtvnw.net/emoticons/v1/39/1.0",
      "FUNgineer": "https://static-cdn.jtvnw.net/emoticons/v1/244/1.0",
      "FunRun": "https://static-cdn.jtvnw.net/emoticons/v1/48/1.0",
      "FuzzyOtterOO": "https://static-cdn.jtvnw.net/emoticons/v1/168/1.0",
      "GingerPower": "https://static-cdn.jtvnw.net/emoticons/v1/32/1.0",
      "GrammarKing": "https://static-cdn.jtvnw.net/emoticons/v1/3632/1.0",
      "HassaanChop": "https://static-cdn.jtvnw.net/emoticons/v1/20225/1.0",
      "HassanChop": "https://static-cdn.jtvnw.net/emoticons/v1/68/1.0",
      "HeyGuys": "https://static-cdn.jtvnw.net/emoticons/v1/30259/1.0",
      "HotPokket": "https://static-cdn.jtvnw.net/emoticons/v1/357/1.0",
      "HumbleLife": "https://static-cdn.jtvnw.net/emoticons/v1/46881/1.0",
      "ItsBoshyTime": "https://static-cdn.jtvnw.net/emoticons/v1/169/1.0",
      "Jebaited": "https://static-cdn.jtvnw.net/emoticons/v1/90/1.0",
      "JKanStyle": "https://static-cdn.jtvnw.net/emoticons/v1/15/1.0",
      "JonCarnage": "https://static-cdn.jtvnw.net/emoticons/v1/26/1.0",
      "KAPOW": "https://static-cdn.jtvnw.net/emoticons/v1/9803/1.0",
      "Kappa": "https://static-cdn.jtvnw.net/emoticons/v1/25/1.0",
      "KappaClaus": "https://static-cdn.jtvnw.net/emoticons/v1/74510/1.0",
      "KappaPride": "https://static-cdn.jtvnw.net/emoticons/v1/55338/1.0",
      "KappaRoss": "https://static-cdn.jtvnw.net/emoticons/v1/70433/1.0",
      "KappaWealth": "https://static-cdn.jtvnw.net/emoticons/v1/81997/1.0",
      "Keepo": "https://static-cdn.jtvnw.net/emoticons/v1/1902/1.0",
      "KevinTurtle": "https://static-cdn.jtvnw.net/emoticons/v1/40/1.0",
      "Kippa": "https://static-cdn.jtvnw.net/emoticons/v1/1901/1.0",
      "Kreygasm": "https://static-cdn.jtvnw.net/emoticons/v1/41/1.0",
      "Mau5": "https://static-cdn.jtvnw.net/emoticons/v1/30134/1.0",
      "mcaT": "https://static-cdn.jtvnw.net/emoticons/v1/35063/1.0",
      "MikeHogu": "https://static-cdn.jtvnw.net/emoticons/v1/81636/1.0",
      "MingLee": "https://static-cdn.jtvnw.net/emoticons/v1/68856/1.0",
      "MrDestructoid": "https://static-cdn.jtvnw.net/emoticons/v1/28/1.0",
      "MVGame": "https://static-cdn.jtvnw.net/emoticons/v1/29/1.0",
      "NinjaTroll": "https://static-cdn.jtvnw.net/emoticons/v1/45/1.0",
      "NomNom": "https://static-cdn.jtvnw.net/emoticons/v1/90075/1.0",
      "NoNoSpot": "https://static-cdn.jtvnw.net/emoticons/v1/44/1.0",
      "NotATK": "https://static-cdn.jtvnw.net/emoticons/v1/34875/1.0",
      "NotLikeThis": "https://static-cdn.jtvnw.net/emoticons/v1/58765/1.0",
      "OhMyDog": "https://static-cdn.jtvnw.net/emoticons/v1/81103/1.0",
      "OMGScoots": "https://static-cdn.jtvnw.net/emoticons/v1/91/1.0",
      "OneHand": "https://static-cdn.jtvnw.net/emoticons/v1/66/1.0",
      "OpieOP": "https://static-cdn.jtvnw.net/emoticons/v1/356/1.0",
      "OptimizePrime": "https://static-cdn.jtvnw.net/emoticons/v1/16/1.0",
      "OSfrog": "https://static-cdn.jtvnw.net/emoticons/v1/81248/1.0",
      "OSkomodo": "https://static-cdn.jtvnw.net/emoticons/v1/81273/1.0",
      "OSsloth": "https://static-cdn.jtvnw.net/emoticons/v1/81249/1.0",
      "panicBasket": "https://static-cdn.jtvnw.net/emoticons/v1/22998/1.0",
      "PanicVis": "https://static-cdn.jtvnw.net/emoticons/v1/3668/1.0",
      "PartyTime": "https://static-cdn.jtvnw.net/emoticons/v1/76171/1.0",
      "PazPazowitz": "https://static-cdn.jtvnw.net/emoticons/v1/19/1.0",
      "PeoplesChamp": "https://static-cdn.jtvnw.net/emoticons/v1/3412/1.0",
      "PermaSmug": "https://static-cdn.jtvnw.net/emoticons/v1/27509/1.0",
      "PeteZaroll": "https://static-cdn.jtvnw.net/emoticons/v1/81243/1.0",
      "PeteZarollTie": "https://static-cdn.jtvnw.net/emoticons/v1/81244/1.0",
      "PicoMause": "https://static-cdn.jtvnw.net/emoticons/v1/27/1.0",
      "PipeHype": "https://static-cdn.jtvnw.net/emoticons/v1/4240/1.0",
      "PJSalt": "https://static-cdn.jtvnw.net/emoticons/v1/36/1.0",
      "PMSTwin": "https://static-cdn.jtvnw.net/emoticons/v1/92/1.0",
      "PogChamp": "https://static-cdn.jtvnw.net/emoticons/v1/88/1.0",
      "Poooound": "https://static-cdn.jtvnw.net/emoticons/v1/358/1.0",
      "PraiseIt": "https://static-cdn.jtvnw.net/emoticons/v1/38586/1.0",
      "PRChase": "https://static-cdn.jtvnw.net/emoticons/v1/28328/1.0",
      "PunchTrees": "https://static-cdn.jtvnw.net/emoticons/v1/47/1.0",
      "PuppeyFace": "https://static-cdn.jtvnw.net/emoticons/v1/58136/1.0",
      "RaccAttack": "https://static-cdn.jtvnw.net/emoticons/v1/27679/1.0",
      "RalpherZ": "https://static-cdn.jtvnw.net/emoticons/v1/1900/1.0",
      "RedCoat": "https://static-cdn.jtvnw.net/emoticons/v1/22/1.0",
      "ResidentSleeper": "https://static-cdn.jtvnw.net/emoticons/v1/245/1.0",
      "riPepperonis": "https://static-cdn.jtvnw.net/emoticons/v1/62833/1.0",
      "RitzMitz": "https://static-cdn.jtvnw.net/emoticons/v1/4338/1.0",
      "RuleFive": "https://static-cdn.jtvnw.net/emoticons/v1/361/1.0",
      "SeemsGood": "https://static-cdn.jtvnw.net/emoticons/v1/64138/1.0",
      "ShadyLulu": "https://static-cdn.jtvnw.net/emoticons/v1/52492/1.0",
      "ShazBotstix": "https://static-cdn.jtvnw.net/emoticons/v1/87/1.0",
      "ShibeZ": "https://static-cdn.jtvnw.net/emoticons/v1/27903/1.0",
      "SmoocherZ": "https://static-cdn.jtvnw.net/emoticons/v1/89945/1.0",
      "SMOrc": "https://static-cdn.jtvnw.net/emoticons/v1/52/1.0",
      "SMSkull": "https://static-cdn.jtvnw.net/emoticons/v1/51/1.0",
      "SoBayed": "https://static-cdn.jtvnw.net/emoticons/v1/1906/1.0",
      "SoonerLater": "https://static-cdn.jtvnw.net/emoticons/v1/355/1.0",
      "SriHead": "https://static-cdn.jtvnw.net/emoticons/v1/14706/1.0",
      "SSSsss": "https://static-cdn.jtvnw.net/emoticons/v1/46/1.0",
      "StinkyCheese": "https://static-cdn.jtvnw.net/emoticons/v1/90076/1.0",
      "StoneLightning": "https://static-cdn.jtvnw.net/emoticons/v1/17/1.0",
      "StrawBeary": "https://static-cdn.jtvnw.net/emoticons/v1/37/1.0",
      "SuperVinlin": "https://static-cdn.jtvnw.net/emoticons/v1/31/1.0",
      "SwiftRage": "https://static-cdn.jtvnw.net/emoticons/v1/34/1.0",
      "TF2John": "https://static-cdn.jtvnw.net/emoticons/v1/1899/1.0",
      "TheRinger": "https://static-cdn.jtvnw.net/emoticons/v1/18/1.0",
      "TheTarFu": "https://static-cdn.jtvnw.net/emoticons/v1/70/1.0",
      "TheThing": "https://static-cdn.jtvnw.net/emoticons/v1/7427/1.0",
      "ThunBeast": "https://static-cdn.jtvnw.net/emoticons/v1/1898/1.0",
      "TinyFace": "https://static-cdn.jtvnw.net/emoticons/v1/67/1.0",
      "TooSpicy": "https://static-cdn.jtvnw.net/emoticons/v1/359/1.0",
      "TriHard": "https://static-cdn.jtvnw.net/emoticons/v1/171/1.0",
      "TTours": "https://static-cdn.jtvnw.net/emoticons/v1/38436/1.0",
      "twitchRaid": "https://static-cdn.jtvnw.net/emoticons/v1/62836/1.0",
      "UleetBackup": "https://static-cdn.jtvnw.net/emoticons/v1/49/1.0",
      "UncleNox": "https://static-cdn.jtvnw.net/emoticons/v1/3666/1.0",
      "UnSane": "https://static-cdn.jtvnw.net/emoticons/v1/71/1.0",
      "VaultBoy": "https://static-cdn.jtvnw.net/emoticons/v1/54090/1.0",
      "VoHiYo": "https://static-cdn.jtvnw.net/emoticons/v1/81274/1.0",
      "Volcania": "https://static-cdn.jtvnw.net/emoticons/v1/166/1.0",
      "WholeWheat": "https://static-cdn.jtvnw.net/emoticons/v1/1896/1.0",
      "WinWaker": "https://static-cdn.jtvnw.net/emoticons/v1/167/1.0",
      "WTRuck": "https://static-cdn.jtvnw.net/emoticons/v1/1897/1.0",
      "WutFace": "https://static-cdn.jtvnw.net/emoticons/v1/28087/1.0",
      "YouWHY": "https://static-cdn.jtvnw.net/emoticons/v1/4337/1.0",
      "MangoForty": "https://static-cdn.jtvnw.net/emoticons/v1/28700/1.0",
      "MangoBANGER": "https://static-cdn.jtvnw.net/emoticons/v1/28701/1.0",
      "MangoBaby": "https://static-cdn.jtvnw.net/emoticons/v1/15163/1.0",
      "MangoCloud9": "https://static-cdn.jtvnw.net/emoticons/v1/15164/1.0",
      "MangoFox": "https://static-cdn.jtvnw.net/emoticons/v1/15165/1.0",
      "MangoFalco": "https://static-cdn.jtvnw.net/emoticons/v1/15166/1.0",
      "MangoAT": "https://static-cdn.jtvnw.net/emoticons/v1/20386/1.0",
      "MangoUSA": "https://static-cdn.jtvnw.net/emoticons/v1/20387/1.0",
      "MangoChamp": "https://static-cdn.jtvnw.net/emoticons/v1/24983/1.0",
      "MangoScorp": "https://static-cdn.jtvnw.net/emoticons/v1/24984/1.0",
      "MangoPog": "https://static-cdn.jtvnw.net/emoticons/v1/81426/1.0",
      "MangoBUSTER": "https://static-cdn.jtvnw.net/emoticons/v1/36469/1.0",
      "Mango19": "https://static-cdn.jtvnw.net/emoticons/v1/36468/1.0",
      "MangoAWP": "https://static-cdn.jtvnw.net/emoticons/v1/39793/1.0",
      "MangoW": "https://static-cdn.jtvnw.net/emoticons/v1/88281/1.0",
      "MangoBat": "https://static-cdn.jtvnw.net/emoticons/v1/46282/1.0",
      "MangoKrey": "https://static-cdn.jtvnw.net/emoticons/v1/45241/1.0",
      "MangoWiener": "https://static-cdn.jtvnw.net/emoticons/v1/49150/1.0",
      "MangoHamburgers": "https://static-cdn.jtvnw.net/emoticons/v1/49346/1.0",
      "MangoANGLE": "https://static-cdn.jtvnw.net/emoticons/v1/61817/1.0",
      "MangoAwCrud": "https://static-cdn.jtvnw.net/emoticons/v1/70602/1.0",
      "MangoNeo": "https://static-cdn.jtvnw.net/emoticons/v1/84600/1.0",
      "MangoRIP": "https://static-cdn.jtvnw.net/emoticons/v1/85173/1.0",
      "MangoL8R": "https://static-cdn.jtvnw.net/emoticons/v1/87498/1.0",
      "MangoDOWN": "https://static-cdn.jtvnw.net/emoticons/v1/89561/1.0"
    };
    ourEmoticons = {
      "Minihalk": "http://imgur.com/4hr3aIW.gif",
      "Halk": "http://smileys.emoticonsonly.com/emoticons/h/hawk-81.gif",
      "KDGI": "http://www.emotiyou.com/galerie/tv/dessins-animes/bob-eponge/bob/201109041811HBR.gif",
      "SloshedJon": "http://i.imgur.com/AZK1PNX.png",
      "FattyFedora": "http://i.imgur.com/jZa8JGR.png",
      "SadKeith": "http://i.imgur.com/6Ji3SUv.png",
      "SadJonjo": "http://i.imgur.com/YYvMFmU.png",
      "MiniDerek": "http://i.imgur.com/d1l7yQK.png",
      "MiniHonry": "http://i.imgur.com/dHdWrqj.png",
      "MiniJonjo": "http://i.imgur.com/fCYpvbZ.png",
      "MiniKeith": "http://i.imgur.com/qCxBqa5.png",
      "ShittersClogged": "http://i.imgur.com/mawXVw5.png",
      "RipKeith": "http://i.imgur.com/JEb2zrl.png",
      "BanePostCia": "http://i.imgur.com/TxZfAFh.png",
      "BanePostBane": "http://i.imgur.com/2tP8nq2.png",
      "GoodShit": "http://emojipedia-us.s3.amazonaws.com/cache/4e/34/4e349487baad811746c02a09fcea0f56.png",
      "DankMemes": "http://i.imgur.com/TKbLBWy.png",
      "DankestMemes": "http://i.imgur.com/bXTDR2r.png",
      "200%Mad": "http://i.imgur.com/DuxEKjJ.png",
      "HonHon": "http://i.imgur.com/onAKPvF.png",
      "CartoonKeith": "http://i.imgur.com/fej5DLu.png",
      "WewLad": "http://i.imgur.com/QeqJ28J.png",
      "VideoTapes": "http://i.imgur.com/bVwmh9q.gif",
      "DootDoot": "http://www.netanimations.net/Moving-picture-skull-playing-coronet-animation.gif",
      "SickSpins": "http://i.imgur.com/BTOckJP.gif",
      "OhYou": "http://i.imgur.com/nvBbE.gif",
      "Gib": "http://i.imgur.com/YYfXLjz.gif",
      "BatemanDubs": "http://i.imgur.com/BkGdKTY.png",
      "KevinPostKevin": "http://i.imgur.com/QsiJIVb.png",
      "RipJon": "http://i.imgur.com/E486QSD.png",
      "RipHenry": "http://i.imgur.com/OfwXCob.png",
      "CrazyKeith": "http://i.imgur.com/JEb2zrl.png",
      "2Spooky": "https://media.giphy.com/media/NT7rUTkLZqQPS/giphy.gif",
      "GreyJon": "http://i.imgur.com/OiCxjHS.png",
      "GrayJon": "http://i.imgur.com/OiCxjHS.png",
      "ZenJon": "http://i.imgur.com/K8rQ0Tk.png",
      "EvansLaugh": "http://i.imgur.com/S3hikEq.png",
      "StrongPotions": "http://i.imgur.com/BloUFZi.png",
      "PotionSeller": "http://i.imgur.com/J9NxZQ4.png",
      "LilJon": "http://i.imgur.com/T0GWs3A.png",
      "ThatsBait": "http://i.imgur.com/N5iUOJa.png",
      "PhilBam": "http://i.imgur.com/IjD6FZi.gif",
      "AmericanRip": "http://i.imgur.com/YRq5HRN.png",
      "666Trips": "http://i.imgur.com/wksDj8i.jpg",
      "MeatRub": "http://img15.deviantart.net/df15/i/2012/237/a/a/gotta_go_fast_by_whiie_z-d5cdoq5.png",
      "4Scoops": "http://i.imgur.com/4AMeQP1.png",
      "BillHitchert": "http://i.imgur.com/5qeuUE7.png",
      "Atodaso": "http://imgur.com/ymH0NVl.png",
      "CmonNow": "http://i.imgur.com/bk7U205.png",
      "JonjoGF": "http://imgur.com/C0IepFR.png",
      "Pepe": "http://i.imgur.com/lG268lj.png",
      "HappyKeith": "http://i.imgur.com/P2F6JuD.png",
      "Cool": "http://i.imgur.com/8mt5E7C.png",
      "ThisIsBait": "http://i.imgur.com/KpvfDHo.png",
      "FacePalm": "http://i.imgur.com/cEkA9zI.png",
      "Gottem": "http://i.imgur.com/9JohgrD.png",
      "Gottum": "http://i.imgur.com/9JohgrD.png",
      "ThisIsFine": "http://imgur.com/fTe3YMx.gif",
      "Tanks": "http://i.imgur.com/XE9zBT8.png",
      "TryNotToCry": "http://imgur.com/LVEnuMe.gif",
      "Hmmm": "http://imgur.com/tzCrrch.png",
      "yeha": "http://i.imgur.com/DySsYTG.png",
      "Yeha": "http://i.imgur.com/DySsYTG.png"
    };
    emoticons = {};
    Object.assign(emoticons, twitchEmoticons);
    Object.assign(emoticons, ourEmoticons);
    purgeRegex = new RegExp("Purge", 'g');
    purgeEmoticon = "<img src=\"http://imgur.com/VbXDnsr.png\" border=\"0\" text-align=\"center !important\" height=\"2000px\" alt=\"Purge\" title=\"Purge emoticon\" style=\"image-rendering: pixelated;\"/>";
    genEmoticon = function(key, big) {
      if (big) {
        return "<img src=\"" + emoticons[key] + "\" border=\"0\" text-align=\"center !important\" height=\"150\" alt=\"" + key + "\" title=\"" + key + " emoticon\" style=\"image-rendering: pixelated;\"/>";
      } else {
        return "<img src=\"" + emoticons[key] + "\" border=\"0\" height=\"35\" alt=\"" + key + "\" title=\"" + key + " emoticon\"/>";
      }
    };
    return {
      replace: function(text, big) {
        var key, link, regex;
        if (purgeRegex.test(text) && big) {
          return text = text.replace(purgeRegex, purgeEmoticon);
        } else {
          for (key in emoticons) {
            link = emoticons[key];
            regex = new RegExp(key, 'g');
            if (big) {
              text = text.replace(regex, genEmoticon(key, big));
            } else {
              text = text.replace(regex, genEmoticon(key, big));
            }
          }
          return text;
        }
      },
      singleEmoticon: function(text) {
        var key, link, regex;
        if (purgeRegex.test(text) && text.replace(purgeRegex, ' ').length === 1) {
          return true;
        }
        for (key in emoticons) {
          link = emoticons[key];
          regex = new RegExp(key, 'g');
          if (regex.test(text) && text.replace(regex, ' ').length === 1) {
            return true;
          }
        }
        return false;
      },
      ourEmoticons: ourEmoticons,
      twitchEmoticons: twitchEmoticons,
      emoticons: emoticons,
      genEmoticon: genEmoticon
    };
  });

}).call(this);