var __importStar = (this && this.__importStar) || function(mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null)
        for (var k in mod)
            if (Object.hasOwnProperty.call(mod, k)) result[k] = mod[k];
    result["default"] = mod;
    return result;
};
Object.defineProperty(exports, "__esModule", { value: true });
const MRE = __importStar(require("@microsoft/mixed-reality-extension-sdk"));
// Load the database of hats.
// eslint-disable-next-line @typescript-eslint/no-var-requires
// const HatDatabase = require('../public/hats.json');
/**
 * WearAHat Application - Showcasing avatar attachments.
 */
class WearAHat {
    /**
     * Constructs a new instance of this class.
     * @param context The MRE SDK context.
     * @param baseUrl The baseUrl to this project's `./public` folder.
     */
    constructor(context) {
            this.context = context;
            this.prefabs = {};
            // Container for instantiated hats.
            this.attachedHats = new Map();
            // use () => {} syntax here to get proper scope binding when called via setTimeout()
            // if async is required, next line becomes private startedImpl = async () => {

            this.assets = new MRE.AssetContainer(context);
            // Hook the context events we're interested in.
            this.cubey = this.assets.loadGltf('strawand.glb', "box");
            this.context.onStarted(() => this.started());
            this.context.onUserLeft(user => this.userLeft(user));
        }
        /**
         * Called when a Hats application session starts up.
         */
    async started() {

            // Check whether code is running in a debuggable watched filesystem
            // environment and if so delay starting the app by 1 second to give
            // the debugger time to detect that the server has restarted and reconnect.
            // The delay value below is in milliseconds so 1000 is a one second delay.
            // You may need to increase the delay or be able to decrease it depending
            // on the speed of your PC.
            const delay = 1000;
            const argv = process.execArgv.join();
            const isDebug = argv.includes('inspect') || argv.includes('debug');
            // // version to use with non-async code
            // if (isDebug) {
            // 	setTimeout(this.startedImpl, delay);
            // } else {
            // 	this.startedImpl();
            // }
            const score = 0;
            this.text = MRE.Actor.Create(this.context, {
                actor: {
                    name: 'Text',

                    transform: {
                        app: { position: { x: 0, y: 1, z: 0 } }
                    },
                    text: {
                        contents: "Find Me!\n" + score,
                        anchor: MRE.TextAnchorLocation.MiddleCenter,
                        color: { r: 255 / 255, g: 255 / 255, b: 255 / 255 },
                        height: 0.3
                    },
                    collider: { geometry: { shape: MRE.ColliderType.Box } },


                }
            });



            this.cube = MRE.Actor.CreateFromPrefab(this.assets, {

                prefab: thcubey,
                actor: {
                    name: 'Info',

                    parentId: this.text.id,

                    transform: {
                        local: {
                            position: {
                                x: -6,
                                y: -1,
                                z: 0
                            },
                            scale: { x: 3, y: 3, z: 3 }
                        }
                    }
                }
            });
            console.log(this.assets.assets)
                // version to use with async code
            if (isDebug) {
                await new Promise(resolve => setTimeout(resolve, delay));
                // await this.startedImpl();
            } else {
                // await this.startedImpl();
            }
        }
        /**
         * Called when a user leaves the application (probably left the Altspace world where this app is running).
         * @param user The user that left the building.
         */
    userLeft(user) {
        // If the user was wearing a hat, destroy it. Otherwise it would be
        // orphaned in the world.
        this.removeHats(user);
    }
    removeHats(user) {
        if (this.attachedHats.has(user.id)) {
            this.attachedHats.get(user.id).destroy();
        }
        this.attachedHats.delete(user.id);
    }
}
exports.default = WearAHat;
//# sourceMappingURL=app.js.map