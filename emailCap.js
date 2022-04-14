const MRE = (require("@microsoft/mixed-reality-extension-sdk"));
const node_fetch_1 = require("axios");
require("dotenv").config();
const slink = process.env.SENDPLAYERSIGNUP

async function sendInfo(_userId, _email) {
    const response = await node_fetch_1.default.post(slink, { id: _userId, email: _email });
    // eslint-disable-next-line no-console
    return response.status
}
class EmailCapture {
    /**
     * Context Constructor
     */
    constructor(context) {
            this.context = context;
            // this.baseUrl = baseUrl;
            // Console debug statements?
            this.DEBUG = true;
            // Internal List of Emails
            this.EmailList = new Map();
            this.position = null;
            this.rotation = null;
            this.buttonActor = null;
            this.labelActor = null;
            this.labelText = "^\n|\nWe need your email\nTo send rewards!";
            this.context.onStarted(() => this.init());
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////
        //
        //  SIGN UP :: Add your address to the emailing list
        //
    async signUp(user) {
            // GET CONTEXT
            const userId = user.id.toString();
            const userName = user.name.toString();
            // const spaceId = user.properties["altspacevr-space-id"].toString();
            // const eventId = user.properties["altspacevr-event-id"];
            // const isEvent = ( eventId === null ) ? false : true;
            // const locationId = (isEvent) ? eventId : spaceId
            if (this.DEBUG) {
                //console.info("\n\n");
                //console.info(" >>> DEBUG >>> userId: " + userId);
                //console.info(" >>> DEBUG >>> spaceId: " + spaceId);
                //console.info(" >>> DEBUG >>> eventId: " + eventId);
                //console.info(" >>> DEBUG >>> isEvent: " + isEvent);
                //console.info(user.context);
                //console.info(user.properties);
            }
            // PROMPT FOR EMAIL
            this.userInput = await user.prompt("Enter your email address:", true);
            if (!this.userInput.submitted || this.userInput.text === '') {
                return;
            }
            const emailAddress = this.userInput.text.toLowerCase();
            // ADD TO LIST
            this.EmailList.set(userId, emailAddress);
            //sendInfo
            sendInfo(userId, emailAddress);
            // RETURN
            return await user.prompt("You entered: " + emailAddress + "\n\n" + userName + " thanks for playing our game!");
        }
        ///////////////////////////////////////////////////////////////////////////////////////////////
        //  
        //  INIT APP
        //
    init() {
        this.assets = new MRE.AssetContainer(this.context);
        // Materials
        this.buttonMaterial = this.assets.createMaterial('buttonMaterial', {
            color: { r: 180 / 255, g: 255 / 255, b: 0 / 255, a: 255 / 255 },
            alphaMode: MRE.AlphaMode.Blend
        });
        // Meshes
        this.buttonMesh = this.assets.createBoxMesh('buttonMesh', .11, .11, .11);
        // Create Button
        // this.position = { x: 8.54, y: 33.5, z: 72 };
        this.position = {
            x: -38.7,
            y: 95.6,
            z: 888.5
        };
        this.rotation = MRE.Quaternion.FromEulerAngles(0 * MRE.DegreesToRadians, 0 * MRE.DegreesToRadians, 0 * MRE.DegreesToRadians);
        this.buttonActor = MRE.Actor.Create(this.context, {
            actor: {
                name: 'Signup Button',
                collider: { geometry: { shape: MRE.ColliderType.Auto } },
                transform: { local: { position: this.position, rotation: this.rotation } },
                appearance: { materialId: this.buttonMaterial.id, meshId: this.buttonMesh.id }
            }
        });
        // Add Text Label
        // this.position = { x: 8.54, y: 33.4, z: 72 };
        this.position = this.position = {
            x: -38.7,
            y: 95.45,
            z: 888.5
        };
        this.rotation = MRE.Quaternion.FromEulerAngles(0 * MRE.DegreesToRadians, -90 * MRE.DegreesToRadians, 0 * MRE.DegreesToRadians);
        this.labelActor = MRE.Actor.Create(this.context, {
            actor: {
                name: 'Button Label',
                transform: { local: { position: this.position, rotation: this.rotation } },
                text: { contents: this.labelText, justify: MRE.TextJustify.Center, anchor: MRE.TextAnchorLocation.MiddleCenter, color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 }, height: 0.035 }
            }
        });
        // On click...
        const buttonBehavior = this.buttonActor.setBehavior(MRE.ButtonBehavior);
        buttonBehavior.onButton('released', (user) => {
            // Trigger signUp() function
            this.signUp(user);
        });
    }
}
exports.default = EmailCapture;