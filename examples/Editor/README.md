# Installer Infographie localement

## Installer les dépendances

### Installer Git
Suivre le guide d'installation de Git pour votre poste de travail :
* [Windows](http://www.git-scm.com/book/en/Getting-Started-Installing-Git#Installing-on-Windows)
* [Mac](http://www.git-scm.com/book/en/Getting-Started-Installing-Git#Installing-on-Mac)
* [Linux](http://www.git-scm.com/book/en/Getting-Started-Installing-Git#Installing-on-Linux)

### Télécharger le code source
Créer un dossier sur votre machine pour conserver le code (Ex: `C:\Infographie`)
Ouvrir un terminal et se déplacer dans ce dossier:
```
cd C:\Infographie
```
Cloner le répertoire Infographie
```
git clone https://github.com/dobobaie/Infographie.git
```

Vous pouvez également utiliser [SourceTree](http://www.sourcetreeapp.com/) pour cloner le répertoire.

### Installer Node JS
* Windows : http://nodejs.org/download/
* Mac : http://nodejs.org/download/
* Ubuntu 14.04 (pour autre version linux : [Documentation Node Linux](https://github.com/joyent/node/wiki/Installing-Node.js-via-package-manager))
```
sudo apt-get update
sudo apt-get install nodejs
sudo apt-get install npm
```

Vérifier que Node est installé avec la commande:
```
node -v
```
Devrais afficher v0.10.x, si vous avez un message d'erreur Node ne s'est pas installé correctement.
Vérifier que Node est installé avec la commande:
```
npm -v
```
Devrais afficher v1.3.x, si vous avez un message d'erreur npm ne s'est pas installé correctement.

### Installer les librairies Node
Lancer la commande suivante dans le répertoire de Infographie (ignorer le message d'erreur):
```
npm install
```
Ensuite installer globalement `gulp`, notre outil de compilation:
```
npm install -g gulp
```
### Compiler et lancer Infographie
Exécuter la commande suivante dans une nouvelle fenêtre de commande dans le répertoire Infographie:
```
gulp serve
```
