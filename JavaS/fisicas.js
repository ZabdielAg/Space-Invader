!function e(t, n, r) {
    function s(o, u) {
        if (!n[o]) {
            if (!t[o]) {
                var a = "function" == typeof require && require;
                if (!u && a)
                    return a(o, !0);
                if (i)
                    return i(o, !0);
                var f = new Error("Cannot find module '" + o + "'");
                throw f.code = "MODULE_NOT_FOUND",
                f
            }
            var l = n[o] = {
                exports: {}
            };
            t[o][0].call(l.exports, function(e) {
                var n = t[o][1][e];
                return s(n || e)
            }, l, l.exports, e, t, n, r)
        }
        return n[o].exports
    }
    for (var i = "function" == typeof require && require, o = 0; o < r.length; o++)
        s(r[o]);
    return s
}({
    1: [function(require, module, exports) {
        var CANNON = require("cannon");
        require("./src/components/math"),
        require("./src/components/body/body"),
        require("./src/components/body/dynamic-body"),
        require("./src/components/body/static-body"),
        require("./src/components/shape/shape"),
        require("./src/components/constraint"),
        require("./src/system"),
        module.exports = {
            registerAll: function() {
                console.warn("registerAll() is deprecated. Components are automatically registered.")
            }
        },
        window.CANNON = window.CANNON || CANNON
    }
    , {
        "./src/components/body/body": 63,
        "./src/components/body/dynamic-body": 64,
        "./src/components/body/static-body": 65,
        "./src/components/constraint": 66,
        "./src/components/math": 67,
        "./src/components/shape/shape": 69,
        "./src/system": 79,
        cannon: 4
    }],
    2: [function(require, module, exports) {
        var CANNON = require("cannon");
        CANNON.shape2mesh = function(body) {
            for (var obj = new THREE.Object3D, l = 0; l < body.shapes.length; l++) {
                var mesh, shape = body.shapes[l];
                switch (shape.type) {
                case CANNON.Shape.types.SPHERE:
                    var sphere_geometry = new THREE.SphereGeometry(shape.radius,8,8);
                    mesh = new THREE.Mesh(sphere_geometry,this.currentMaterial);
                    break;
                case CANNON.Shape.types.PARTICLE:
                    mesh = new THREE.Mesh(this.particleGeo,this.particleMaterial);
                    var s = this.settings;
                    mesh.scale.set(s.particleSize, s.particleSize, s.particleSize);
                    break;
                case CANNON.Shape.types.PLANE:
                    geometry = new THREE.PlaneGeometry(10,10,4,4);
                    mesh = new THREE.Object3D;
                    var submesh = new THREE.Object3D
                      , ground = new THREE.Mesh(geometry,this.currentMaterial);
                    ground.scale.set(100, 100, 100),
                    submesh.add(ground),
                    ground.castShadow = !0,
                    ground.receiveShadow = !0,
                    mesh.add(submesh);
                    break;
                case CANNON.Shape.types.BOX:
                    var box_geometry = new THREE.BoxGeometry(2 * shape.halfExtents.x,2 * shape.halfExtents.y,2 * shape.halfExtents.z);
                    mesh = new THREE.Mesh(box_geometry,this.currentMaterial);
                    break;
                case CANNON.Shape.types.CONVEXPOLYHEDRON:
                    for (var geo = new THREE.Geometry, i = 0; i < shape.vertices.length; i++) {
                        var v = shape.vertices[i];
                        geo.vertices.push(new THREE.Vector3(v.x,v.y,v.z))
                    }
                    for (i = 0; i < shape.faces.length; i++)
                        for (var face = shape.faces[i], a = face[0], j = 1; j < face.length - 1; j++) {
                            var b = face[j]
                              , c = face[j + 1];
                            geo.faces.push(new THREE.Face3(a,b,c))
                        }
                    geo.computeBoundingSphere(),
                    geo.computeFaceNormals(),
                    mesh = new THREE.Mesh(geo,this.currentMaterial);
                    break;
                case CANNON.Shape.types.HEIGHTFIELD:
                    for (var geometry = new THREE.Geometry, v0 = new CANNON.Vec3, v1 = new CANNON.Vec3, v2 = new CANNON.Vec3, xi = 0; xi < shape.data.length - 1; xi++)
                        for (var yi = 0; yi < shape.data[xi].length - 1; yi++)
                            for (var k = 0; k < 2; k++) {
                                shape.getConvexTrianglePillar(xi, yi, 0 === k),
                                v0.copy(shape.pillarConvex.vertices[0]),
                                v1.copy(shape.pillarConvex.vertices[1]),
                                v2.copy(shape.pillarConvex.vertices[2]),
                                v0.vadd(shape.pillarOffset, v0),
                                v1.vadd(shape.pillarOffset, v1),
                                v2.vadd(shape.pillarOffset, v2),
                                geometry.vertices.push(new THREE.Vector3(v0.x,v0.y,v0.z), new THREE.Vector3(v1.x,v1.y,v1.z), new THREE.Vector3(v2.x,v2.y,v2.z));
                                i = geometry.vertices.length - 3;
                                geometry.faces.push(new THREE.Face3(i,i + 1,i + 2))
                            }
                    geometry.computeBoundingSphere(),
                    geometry.computeFaceNormals(),
                    mesh = new THREE.Mesh(geometry,this.currentMaterial);
                    break;
                case CANNON.Shape.types.TRIMESH:
                    for (var geometry = new THREE.Geometry, v0 = new CANNON.Vec3, v1 = new CANNON.Vec3, v2 = new CANNON.Vec3, i = 0; i < shape.indices.length / 3; i++) {
                        shape.getTriangleVertices(i, v0, v1, v2),
                        geometry.vertices.push(new THREE.Vector3(v0.x,v0.y,v0.z), new THREE.Vector3(v1.x,v1.y,v1.z), new THREE.Vector3(v2.x,v2.y,v2.z));
                        j = geometry.vertices.length - 3;
                        geometry.faces.push(new THREE.Face3(j,j + 1,j + 2))
                    }
                    geometry.computeBoundingSphere(),
                    geometry.computeFaceNormals(),
                    mesh = new THREE.Mesh(geometry,this.currentMaterial);
                    break;
                default:
                    throw "Visual type not recognized: " + shape.type
                }
                if (mesh.receiveShadow = !0,
                mesh.castShadow = !0,
                mesh.children)
                    for (i = 0; i < mesh.children.length; i++)
                        if (mesh.children[i].castShadow = !0,
                        mesh.children[i].receiveShadow = !0,
                        mesh.children[i])
                            for (j = 0; j < mesh.children[i].length; j++)
                                mesh.children[i].children[j].castShadow = !0,
                                mesh.children[i].children[j].receiveShadow = !0;
                var o = body.shapeOffsets[l]
                  , q = body.shapeOrientations[l];
                mesh.position.set(o.x, o.y, o.z),
                mesh.quaternion.set(q.x, q.y, q.z, q.w),
                obj.add(mesh)
            }
            return obj
        }
        ,
        module.exports = CANNON.shape2mesh
    }
    , {
        cannon: 4
    }],
    3: [function(require, module, exports) {
        module.exports = {
            _args: [[{
                raw: "github:donmccurdy/cannon.js#v0.6.2-dev1",
                scope: null,
                escapedName: null,
                name: null,
                rawSpec: "github:donmccurdy/cannon.js#v0.6.2-dev1",
                spec: "github:donmccurdy/cannon.js#v0.6.2-dev1",
                type: "hosted",
                hosted: {
                    type: "github",
                    ssh: "git@github.com:donmccurdy/cannon.js.git#v0.6.2-dev1",
                    sshUrl: "git+ssh://git@github.com/donmccurdy/cannon.js.git#v0.6.2-dev1",
                    httpsUrl: "git+https://github.com/donmccurdy/cannon.js.git#v0.6.2-dev1",
                    gitUrl: "git://github.com/donmccurdy/cannon.js.git#v0.6.2-dev1",
                    shortcut: "github:donmccurdy/cannon.js#v0.6.2-dev1",
                    directUrl: "https://raw.githubusercontent.com/donmccurdy/cannon.js/v0.6.2-dev1/package.json"
                }
            }, "/Users/donmccurdy/Documents/Projects/aframe-physics-system"]],
            _from: "donmccurdy/cannon.js#v0.6.2-dev1",
            _id: "cannon@0.6.2",
            _inCache: !0,
            _location: "/cannon",
            _phantomChildren: {},
            _requested: {
                raw: "github:donmccurdy/cannon.js#v0.6.2-dev1",
                scope: null,
                escapedName: null,
                name: null,
                rawSpec: "github:donmccurdy/cannon.js#v0.6.2-dev1",
                spec: "github:donmccurdy/cannon.js#v0.6.2-dev1",
                type: "hosted",
                hosted: {
                    type: "github",
                    ssh: "git@github.com:donmccurdy/cannon.js.git#v0.6.2-dev1",
                    sshUrl: "git+ssh://git@github.com/donmccurdy/cannon.js.git#v0.6.2-dev1",
                    httpsUrl: "git+https://github.com/donmccurdy/cannon.js.git#v0.6.2-dev1",
                    gitUrl: "git://github.com/donmccurdy/cannon.js.git#v0.6.2-dev1",
                    shortcut: "github:donmccurdy/cannon.js#v0.6.2-dev1",
                    directUrl: "https://raw.githubusercontent.com/donmccurdy/cannon.js/v0.6.2-dev1/package.json"
                }
            },
            _requiredBy: ["#USER", "/"],
            _resolved: "git://github.com/donmccurdy/cannon.js.git#022e8ba53fa83abf0ad8a0e4fd08623123838a17",
            _shasum: "a5e7db2d2abf1a0a2624842568e5a86acc9d1114",
            _shrinkwrap: null,
            _spec: "github:donmccurdy/cannon.js#v0.6.2-dev1",
            _where: "/Users/donmccurdy/Documents/Projects/aframe-physics-system",
            author: {
                name: "Stefan Hedman",
                email: "schteppe@gmail.com",
                url: "http://steffe.se"
            },
            bugs: {
                url: "https://github.com/schteppe/cannon.js/issues"
            },
            dependencies: {},
            description: "A lightweight 3D physics engine written in JavaScript.",
            devDependencies: {
                browserify: "*",
                grunt: "~0.4.0",
                "grunt-browserify": "^2.1.4",
                "grunt-contrib-concat": "~0.1.3",
                "grunt-contrib-jshint": "~0.1.1",
                "grunt-contrib-nodeunit": "^0.4.1",
                "grunt-contrib-uglify": "^0.5.1",
                "grunt-contrib-yuidoc": "^0.5.2",
                jshint: "latest",
                nodeunit: "^0.9.0",
                "uglify-js": "latest"
            },
            engines: {
                node: "*"
            },
            gitHead: "022e8ba53fa83abf0ad8a0e4fd08623123838a17",
            homepage: "https://github.com/schteppe/cannon.js",
            keywords: ["cannon.js", "cannon", "physics", "engine", "3d"],
            licenses: [{
                type: "MIT"
            }],
            main: "./src/Cannon.js",
            name: "cannon",
            optionalDependencies: {},
            readme: '# cannon.js\n\n### Lightweight 3D physics for the web\nInspired by [three.js](https://github.com/mrdoob/three.js) and [ammo.js](https://github.com/kripken/ammo.js), and driven by the fact that the web lacks a physics engine, here comes cannon.js.\nThe rigid body physics engine includes simple collision detection, various body shapes, contacts, friction and constraints.\n\n[Demos](http://schteppe.github.com/cannon.js) - [Documentation](http://schteppe.github.com/cannon.js/docs) - [Rendering hints](https://github.com/schteppe/cannon.js/tree/master/examples) - [NPM package](https://npmjs.org/package/cannon) - [CDN](https://cdnjs.com/libraries/cannon.js)\n\n### Browser install\n\nJust include [cannon.js](https://github.com/schteppe/cannon.js/releases/download/v0.6.2/cannon.js) or [cannon.min.js](https://github.com/schteppe/cannon.js/releases/download/v0.6.2/cannon.min.js) in your html and you\'re done:\n\n```html\n<script src="cannon.min.js"><\/script>\n```\n\n### Node.js install\n\nInstall the cannon package via NPM:\n\n```bash\nnpm install --save cannon\n```\n\nAlternatively, point to the Github repo directly to get the very latest version:\n\n```bash\nnpm install --save schteppe/cannon.js\n```\n\n### Example\n\nThe sample code below creates a sphere on a plane, steps the simulation, and prints the sphere simulation to the console. Note that Cannon.js uses [SI units](http://en.wikipedia.org/wiki/International_System_of_Units) (metre, kilogram, second, etc.).\n\n```javascript\n// Setup our world\nvar world = new CANNON.World();\nworld.gravity.set(0, 0, -9.82); // m/s²\n\n// Create a sphere\nvar radius = 1; // m\nvar sphereBody = new CANNON.Body({\n   mass: 5, // kg\n   position: new CANNON.Vec3(0, 0, 10), // m\n   shape: new CANNON.Sphere(radius)\n});\nworld.addBody(sphereBody);\n\n// Create a plane\nvar groundBody = new CANNON.Body({\n    mass: 0 // mass == 0 makes the body static\n});\nvar groundShape = new CANNON.Plane();\ngroundBody.addShape(groundShape);\nworld.addBody(groundBody);\n\nvar fixedTimeStep = 1.0 / 60.0; // seconds\nvar maxSubSteps = 3;\n\n// Start the simulation loop\nvar lastTime;\n(function simloop(time){\n  requestAnimationFrame(simloop);\n  if(lastTime !== undefined){\n     var dt = (time - lastTime) / 1000;\n     world.step(fixedTimeStep, dt, maxSubSteps);\n  }\n  console.log("Sphere z position: " + sphereBody.position.z);\n  lastTime = time;\n})();\n```\n\nIf you want to know how to use cannon.js with a rendering engine, for example Three.js, see the [Examples](examples).\n\n### Features\n* Rigid body dynamics\n* Discrete collision detection\n* Contacts, friction and restitution\n* Constraints\n   * PointToPoint (a.k.a. ball/socket joint)\n   * Distance\n   * Hinge (with optional motor)\n   * Lock\n   * ConeTwist\n* Gauss-Seidel constraint solver and an island split algorithm\n* Collision filters\n* Body sleeping\n* Experimental SPH / fluid support\n* Various shapes and collision algorithms (see table below)\n\n|             | [Sphere](http://schteppe.github.io/cannon.js/docs/classes/Sphere.html) | [Plane](http://schteppe.github.io/cannon.js/docs/classes/Plane.html) | [Box](http://schteppe.github.io/cannon.js/docs/classes/Box.html) | [Convex](http://schteppe.github.io/cannon.js/docs/classes/ConvexPolyhedron.html) | [Particle](http://schteppe.github.io/cannon.js/docs/classes/Particle.html) | [Heightfield](http://schteppe.github.io/cannon.js/docs/classes/Heightfield.html) | [Trimesh](http://schteppe.github.io/cannon.js/docs/classes/Trimesh.html) |\n| :-----------|:------:|:-----:|:---:|:------:|:--------:|:-----------:|:-------:|\n| Sphere      | Yes    | Yes   | Yes | Yes    | Yes      | Yes         | Yes     |\n| Plane       | -      | -     | Yes | Yes    | Yes      | -           | Yes     |\n| Box         | -      | -     | Yes | Yes    | Yes      | Yes         | (todo)  |\n| Cylinder    | -      | -     | Yes | Yes    | Yes      | Yes         | (todo)  |\n| Convex      | -      | -     | -   | Yes    | Yes      | Yes         | (todo)  |\n| Particle    | -      | -     | -   | -      | -        | (todo)      | (todo)  |\n| Heightfield | -      | -     | -   | -      | -        | -           | (todo)  |\n| Trimesh     | -      | -     | -   | -      | -        | -           | -       |\n\n### Todo\nThe simpler todos are marked with ```@todo``` in the code. Github Issues can and should also be used for todos.\n\n### Help\nCreate an [issue](https://github.com/schteppe/cannon.js/issues) if you need help.\n',
            readmeFilename: "README.markdown",
            repository: {
                type: "git",
                url: "git+https://github.com/schteppe/cannon.js.git"
            },
            version: "0.6.2"
        }
    }
    , {}],
    4: [function(require, module, exports) {
        module.exports = {
            version: require("../package.json").version,
            AABB: require("./collision/AABB"),
            ArrayCollisionMatrix: require("./collision/ArrayCollisionMatrix"),
            Body: require("./objects/Body"),
            Box: require("./shapes/Box"),
            Broadphase: require("./collision/Broadphase"),
            Constraint: require("./constraints/Constraint"),
            ContactEquation: require("./equations/ContactEquation"),
            Narrowphase: require("./world/Narrowphase"),
            ConeTwistConstraint: require("./constraints/ConeTwistConstraint"),
            ContactMaterial: require("./material/ContactMaterial"),
            ConvexPolyhedron: require("./shapes/ConvexPolyhedron"),
            Cylinder: require("./shapes/Cylinder"),
            DistanceConstraint: require("./constraints/DistanceConstraint"),
            Equation: require("./equations/Equation"),
            EventTarget: require("./utils/EventTarget"),
            FrictionEquation: require("./equations/FrictionEquation"),
            GSSolver: require("./solver/GSSolver"),
            GridBroadphase: require("./collision/GridBroadphase"),
            Heightfield: require("./shapes/Heightfield"),
            HingeConstraint: require("./constraints/HingeConstraint"),
            LockConstraint: require("./constraints/LockConstraint"),
            Mat3: require("./math/Mat3"),
            Material: require("./material/Material"),
            NaiveBroadphase: require("./collision/NaiveBroadphase"),
            ObjectCollisionMatrix: require("./collision/ObjectCollisionMatrix"),
            Pool: require("./utils/Pool"),
            Particle: require("./shapes/Particle"),
            Plane: require("./shapes/Plane"),
            PointToPointConstraint: require("./constraints/PointToPointConstraint"),
            Quaternion: require("./math/Quaternion"),
            Ray: require("./collision/Ray"),
            RaycastVehicle: require("./objects/RaycastVehicle"),
            RaycastResult: require("./collision/RaycastResult"),
            RigidVehicle: require("./objects/RigidVehicle"),
            RotationalEquation: require("./equations/RotationalEquation"),
            RotationalMotorEquation: require("./equations/RotationalMotorEquation"),
            SAPBroadphase: require("./collision/SAPBroadphase"),
            SPHSystem: require("./objects/SPHSystem"),
            Shape: require("./shapes/Shape"),
            Solver: require("./solver/Solver"),
            Sphere: require("./shapes/Sphere"),
            SplitSolver: require("./solver/SplitSolver"),
            Spring: require("./objects/Spring"),
            Transform: require("./math/Transform"),
            Trimesh: require("./shapes/Trimesh"),
            Vec3: require("./math/Vec3"),
            Vec3Pool: require("./utils/Vec3Pool"),
            World: require("./world/World")
        }
    }
    , {
        "../package.json": 3,
        "./collision/AABB": 5,
        "./collision/ArrayCollisionMatrix": 6,
        "./collision/Broadphase": 7,
        "./collision/GridBroadphase": 8,
        "./collision/NaiveBroadphase": 9,
        "./collision/ObjectCollisionMatrix": 10,
        "./collision/Ray": 12,
        "./collision/RaycastResult": 13,
        "./collision/SAPBroadphase": 14,
        "./constraints/ConeTwistConstraint": 15,
        "./constraints/Constraint": 16,
        "./constraints/DistanceConstraint": 17,
        "./constraints/HingeConstraint": 18,
        "./constraints/LockConstraint": 19,
        "./constraints/PointToPointConstraint": 20,
        "./equations/ContactEquation": 22,
        "./equations/Equation": 23,
        "./equations/FrictionEquation": 24,
        "./equations/RotationalEquation": 25,
        "./equations/RotationalMotorEquation": 26,
        "./material/ContactMaterial": 27,
        "./material/Material": 28,
        "./math/Mat3": 30,
        "./math/Quaternion": 31,
        "./math/Transform": 32,
        "./math/Vec3": 33,
        "./objects/Body": 34,
        "./objects/RaycastVehicle": 35,
        "./objects/RigidVehicle": 36,
        "./objects/SPHSystem": 37,
        "./objects/Spring": 38,
        "./shapes/Box": 40,
        "./shapes/ConvexPolyhedron": 41,
        "./shapes/Cylinder": 42,
        "./shapes/Heightfield": 43,
        "./shapes/Particle": 44,
        "./shapes/Plane": 45,
        "./shapes/Shape": 46,
        "./shapes/Sphere": 47,
        "./shapes/Trimesh": 48,
        "./solver/GSSolver": 49,
        "./solver/Solver": 50,
        "./solver/SplitSolver": 51,
        "./utils/EventTarget": 52,
        "./utils/Pool": 54,
        "./utils/Vec3Pool": 57,
        "./world/Narrowphase": 58,
        "./world/World": 59
    }],
    5: [function(require, module, exports) {
        function AABB(options) {
            options = options || {},
            this.lowerBound = new Vec3,
            options.lowerBound && this.lowerBound.copy(options.lowerBound),
            this.upperBound = new Vec3,
            options.upperBound && this.upperBound.copy(options.upperBound)
        }
        var Vec3 = require("../math/Vec3");
        require("../utils/Utils");
        module.exports = AABB;
        var tmp = new Vec3;
        AABB.prototype.setFromPoints = function(points, position, quaternion, skinSize) {
            var l = this.lowerBound
              , u = this.upperBound
              , q = quaternion;
            l.copy(points[0]),
            q && q.vmult(l, l),
            u.copy(l);
            for (var i = 1; i < points.length; i++) {
                var p = points[i];
                q && (q.vmult(p, tmp),
                p = tmp),
                p.x > u.x && (u.x = p.x),
                p.x < l.x && (l.x = p.x),
                p.y > u.y && (u.y = p.y),
                p.y < l.y && (l.y = p.y),
                p.z > u.z && (u.z = p.z),
                p.z < l.z && (l.z = p.z)
            }
            return position && (position.vadd(l, l),
            position.vadd(u, u)),
            skinSize && (l.x -= skinSize,
            l.y -= skinSize,
            l.z -= skinSize,
            u.x += skinSize,
            u.y += skinSize,
            u.z += skinSize),
            this
        }
        ,
        AABB.prototype.copy = function(aabb) {
            return this.lowerBound.copy(aabb.lowerBound),
            this.upperBound.copy(aabb.upperBound),
            this
        }
        ,
        AABB.prototype.clone = function() {
            return (new AABB).copy(this)
        }
        ,
        AABB.prototype.extend = function(aabb) {
            this.lowerBound.x = Math.min(this.lowerBound.x, aabb.lowerBound.x),
            this.upperBound.x = Math.max(this.upperBound.x, aabb.upperBound.x),
            this.lowerBound.y = Math.min(this.lowerBound.y, aabb.lowerBound.y),
            this.upperBound.y = Math.max(this.upperBound.y, aabb.upperBound.y),
            this.lowerBound.z = Math.min(this.lowerBound.z, aabb.lowerBound.z),
            this.upperBound.z = Math.max(this.upperBound.z, aabb.upperBound.z)
        }
        ,
        AABB.prototype.overlaps = function(aabb) {
            var l1 = this.lowerBound
              , u1 = this.upperBound
              , l2 = aabb.lowerBound
              , u2 = aabb.upperBound
              , overlapsX = l2.x <= u1.x && u1.x <= u2.x || l1.x <= u2.x && u2.x <= u1.x
              , overlapsY = l2.y <= u1.y && u1.y <= u2.y || l1.y <= u2.y && u2.y <= u1.y
              , overlapsZ = l2.z <= u1.z && u1.z <= u2.z || l1.z <= u2.z && u2.z <= u1.z;
            return overlapsX && overlapsY && overlapsZ
        }
        ,
        AABB.prototype.volume = function() {
            var l = this.lowerBound
              , u = this.upperBound;
            return (u.x - l.x) * (u.y - l.y) * (u.z - l.z)
        }
        ,
        AABB.prototype.contains = function(aabb) {
            var l1 = this.lowerBound
              , u1 = this.upperBound
              , l2 = aabb.lowerBound
              , u2 = aabb.upperBound;
            return l1.x <= l2.x && u1.x >= u2.x && l1.y <= l2.y && u1.y >= u2.y && l1.z <= l2.z && u1.z >= u2.z
        }
        ,
        AABB.prototype.getCorners = function(a, b, c, d, e, f, g, h) {
            var l = this.lowerBound
              , u = this.upperBound;
            a.copy(l),
            b.set(u.x, l.y, l.z),
            c.set(u.x, u.y, l.z),
            d.set(l.x, u.y, u.z),
            e.set(u.x, l.y, l.z),
            f.set(l.x, u.y, l.z),
            g.set(l.x, l.y, u.z),
            h.copy(u)
        }
        ;
        var transformIntoFrame_corners = [new Vec3, new Vec3, new Vec3, new Vec3, new Vec3, new Vec3, new Vec3, new Vec3];
        AABB.prototype.toLocalFrame = function(frame, target) {
            var corners = transformIntoFrame_corners
              , a = corners[0]
              , b = corners[1]
              , c = corners[2]
              , d = corners[3]
              , e = corners[4]
              , f = corners[5]
              , g = corners[6]
              , h = corners[7];
            this.getCorners(a, b, c, d, e, f, g, h);
            for (var i = 0; 8 !== i; i++) {
                var corner = corners[i];
                frame.pointToLocal(corner, corner)
            }
            return target.setFromPoints(corners)
        }
        ,
        AABB.prototype.toWorldFrame = function(frame, target) {
            var corners = transformIntoFrame_corners
              , a = corners[0]
              , b = corners[1]
              , c = corners[2]
              , d = corners[3]
              , e = corners[4]
              , f = corners[5]
              , g = corners[6]
              , h = corners[7];
            this.getCorners(a, b, c, d, e, f, g, h);
            for (var i = 0; 8 !== i; i++) {
                var corner = corners[i];
                frame.pointToWorld(corner, corner)
            }
            return target.setFromPoints(corners)
        }
        ,
        AABB.prototype.overlapsRay = function(ray) {
            var dirFracX = 1 / ray._direction.x
              , dirFracY = 1 / ray._direction.y
              , dirFracZ = 1 / ray._direction.z
              , t1 = (this.lowerBound.x - ray.from.x) * dirFracX
              , t2 = (this.upperBound.x - ray.from.x) * dirFracX
              , t3 = (this.lowerBound.y - ray.from.y) * dirFracY
              , t4 = (this.upperBound.y - ray.from.y) * dirFracY
              , t5 = (this.lowerBound.z - ray.from.z) * dirFracZ
              , t6 = (this.upperBound.z - ray.from.z) * dirFracZ
              , tmin = Math.max(Math.max(Math.min(t1, t2), Math.min(t3, t4)), Math.min(t5, t6))
              , tmax = Math.min(Math.min(Math.max(t1, t2), Math.max(t3, t4)), Math.max(t5, t6));
            return !(tmax < 0) && !(tmin > tmax)
        }
    }
    , {
        "../math/Vec3": 33,
        "../utils/Utils": 56
    }],
    6: [function(require, module, exports) {
        function ArrayCollisionMatrix() {
            this.matrix = []
        }
        module.exports = ArrayCollisionMatrix,
        ArrayCollisionMatrix.prototype.get = function(i, j) {
            if (i = i.index,
            (j = j.index) > i) {
                var temp = j;
                j = i,
                i = temp
            }
            return this.matrix[(i * (i + 1) >> 1) + j - 1]
        }
        ,
        ArrayCollisionMatrix.prototype.set = function(i, j, value) {
            if (i = i.index,
            (j = j.index) > i) {
                var temp = j;
                j = i,
                i = temp
            }
            this.matrix[(i * (i + 1) >> 1) + j - 1] = value ? 1 : 0
        }
        ,
        ArrayCollisionMatrix.prototype.reset = function() {
            for (var i = 0, l = this.matrix.length; i !== l; i++)
                this.matrix[i] = 0
        }
        ,
        ArrayCollisionMatrix.prototype.setNumObjects = function(n) {
            this.matrix.length = n * (n - 1) >> 1
        }
    }
    , {}],
    7: [function(require, module, exports) {
        function Broadphase() {
            this.world = null,
            this.useBoundingBoxes = !1,
            this.dirty = !0
        }
        var Body = require("../objects/Body")
          , Vec3 = require("../math/Vec3")
          , Quaternion = require("../math/Quaternion");
        require("../shapes/Shape"),
        require("../shapes/Plane");
        module.exports = Broadphase,
        Broadphase.prototype.collisionPairs = function(world, p1, p2) {
            throw new Error("collisionPairs not implemented for this BroadPhase class!")
        }
        ,
        Broadphase.prototype.needBroadphaseCollision = function(bodyA, bodyB) {
            return 0 != (bodyA.collisionFilterGroup & bodyB.collisionFilterMask) && 0 != (bodyB.collisionFilterGroup & bodyA.collisionFilterMask) && (0 == (bodyA.type & Body.STATIC) && bodyA.sleepState !== Body.SLEEPING || 0 == (bodyB.type & Body.STATIC) && bodyB.sleepState !== Body.SLEEPING)
        }
        ,
        Broadphase.prototype.intersectionTest = function(bodyA, bodyB, pairs1, pairs2) {
            this.useBoundingBoxes ? this.doBoundingBoxBroadphase(bodyA, bodyB, pairs1, pairs2) : this.doBoundingSphereBroadphase(bodyA, bodyB, pairs1, pairs2)
        }
        ;
        var Broadphase_collisionPairs_r = new Vec3;
        new Vec3,
        new Quaternion,
        new Vec3;
        Broadphase.prototype.doBoundingSphereBroadphase = function(bodyA, bodyB, pairs1, pairs2) {
            var r = Broadphase_collisionPairs_r;
            bodyB.position.vsub(bodyA.position, r);
            var boundingRadiusSum2 = Math.pow(bodyA.boundingRadius + bodyB.boundingRadius, 2);
            r.norm2() < boundingRadiusSum2 && (pairs1.push(bodyA),
            pairs2.push(bodyB))
        }
        ,
        Broadphase.prototype.doBoundingBoxBroadphase = function(bodyA, bodyB, pairs1, pairs2) {
            bodyA.aabbNeedsUpdate && bodyA.computeAABB(),
            bodyB.aabbNeedsUpdate && bodyB.computeAABB(),
            bodyA.aabb.overlaps(bodyB.aabb) && (pairs1.push(bodyA),
            pairs2.push(bodyB))
        }
        ;
        var Broadphase_makePairsUnique_temp = {
            keys: []
        }
          , Broadphase_makePairsUnique_p1 = []
          , Broadphase_makePairsUnique_p2 = [];
        Broadphase.prototype.makePairsUnique = function(pairs1, pairs2) {
            for (var t = Broadphase_makePairsUnique_temp, p1 = Broadphase_makePairsUnique_p1, p2 = Broadphase_makePairsUnique_p2, N = pairs1.length, i = 0; i !== N; i++)
                p1[i] = pairs1[i],
                p2[i] = pairs2[i];
            pairs1.length = 0,
            pairs2.length = 0;
            for (i = 0; i !== N; i++) {
                var id1 = p1[i].id
                  , id2 = p2[i].id;
                t[key = id1 < id2 ? id1 + "," + id2 : id2 + "," + id1] = i,
                t.keys.push(key)
            }
            for (i = 0; i !== t.keys.length; i++) {
                var key = t.keys.pop()
                  , pairIndex = t[key];
                pairs1.push(p1[pairIndex]),
                pairs2.push(p2[pairIndex]),
                delete t[key]
            }
        }
        ,
        Broadphase.prototype.setWorld = function(world) {}
        ;
        var bsc_dist = new Vec3;
        Broadphase.boundingSphereCheck = function(bodyA, bodyB) {
            var dist = bsc_dist;
            return bodyA.position.vsub(bodyB.position, dist),
            Math.pow(bodyA.shape.boundingSphereRadius + bodyB.shape.boundingSphereRadius, 2) > dist.norm2()
        }
        ,
        Broadphase.prototype.aabbQuery = function(world, aabb, result) {
            return console.warn(".aabbQuery is not implemented in this Broadphase subclass."),
            []
        }
    }
    , {
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "../objects/Body": 34,
        "../shapes/Plane": 45,
        "../shapes/Shape": 46
    }],
    8: [function(require, module, exports) {
        function GridBroadphase(aabbMin, aabbMax, nx, ny, nz) {
            Broadphase.apply(this),
            this.nx = nx || 10,
            this.ny = ny || 10,
            this.nz = nz || 10,
            this.aabbMin = aabbMin || new Vec3(100,100,100),
            this.aabbMax = aabbMax || new Vec3(-100,-100,-100);
            var nbins = this.nx * this.ny * this.nz;
            if (nbins <= 0)
                throw "GridBroadphase: Each dimension's n must be >0";
            this.bins = [],
            this.binLengths = [],
            this.bins.length = nbins,
            this.binLengths.length = nbins;
            for (var i = 0; i < nbins; i++)
                this.bins[i] = [],
                this.binLengths[i] = 0
        }
        module.exports = GridBroadphase;
        var Broadphase = require("./Broadphase")
          , Vec3 = require("../math/Vec3")
          , Shape = require("../shapes/Shape");
        GridBroadphase.prototype = new Broadphase,
        GridBroadphase.prototype.constructor = GridBroadphase;
        var GridBroadphase_collisionPairs_d = new Vec3;
        new Vec3;
        GridBroadphase.prototype.collisionPairs = function(world, pairs1, pairs2) {
            function addBoxToBins(x0, y0, z0, x1, y1, z1, bi) {
                var xoff0 = (x0 - xmin) * xmult | 0
                  , yoff0 = (y0 - ymin) * ymult | 0
                  , zoff0 = (z0 - zmin) * zmult | 0
                  , xoff1 = ceil((x1 - xmin) * xmult)
                  , yoff1 = ceil((y1 - ymin) * ymult)
                  , zoff1 = ceil((z1 - zmin) * zmult);
                xoff0 < 0 ? xoff0 = 0 : xoff0 >= nx && (xoff0 = nx - 1),
                yoff0 < 0 ? yoff0 = 0 : yoff0 >= ny && (yoff0 = ny - 1),
                zoff0 < 0 ? zoff0 = 0 : zoff0 >= nz && (zoff0 = nz - 1),
                xoff1 < 0 ? xoff1 = 0 : xoff1 >= nx && (xoff1 = nx - 1),
                yoff1 < 0 ? yoff1 = 0 : yoff1 >= ny && (yoff1 = ny - 1),
                zoff1 < 0 ? zoff1 = 0 : zoff1 >= nz && (zoff1 = nz - 1),
                yoff0 *= ystep,
                zoff0 *= zstep,
                xoff1 *= xstep,
                yoff1 *= ystep,
                zoff1 *= zstep;
                for (var xoff = xoff0 *= xstep; xoff <= xoff1; xoff += xstep)
                    for (var yoff = yoff0; yoff <= yoff1; yoff += ystep)
                        for (var zoff = zoff0; zoff <= zoff1; zoff += zstep) {
                            var idx = xoff + yoff + zoff;
                            bins[idx][binLengths[idx]++] = bi
                        }
            }
            for (var N = world.numObjects(), bodies = world.bodies, max = this.aabbMax, min = this.aabbMin, nx = this.nx, ny = this.ny, nz = this.nz, xstep = ny * nz, ystep = nz, zstep = 1, xmax = max.x, ymax = max.y, zmax = max.z, xmin = min.x, ymin = min.y, zmin = min.z, xmult = nx / (xmax - xmin), ymult = ny / (ymax - ymin), zmult = nz / (zmax - zmin), binsizeX = (xmax - xmin) / nx, binsizeY = (ymax - ymin) / ny, binsizeZ = (zmax - zmin) / nz, binRadius = .5 * Math.sqrt(binsizeX * binsizeX + binsizeY * binsizeY + binsizeZ * binsizeZ), types = Shape.types, SPHERE = types.SPHERE, PLANE = types.PLANE, bins = (types.BOX,
            types.COMPOUND,
            types.CONVEXPOLYHEDRON,
            this.bins), binLengths = this.binLengths, Nbins = this.bins.length, i = 0; i !== Nbins; i++)
                binLengths[i] = 0;
            for (var ceil = Math.ceil, min = Math.min, max = Math.max, i = 0; i !== N; i++) {
                var si = (bi = bodies[i]).shape;
                switch (si.type) {
                case SPHERE:
                    var x = bi.position.x
                      , y = bi.position.y
                      , z = bi.position.z
                      , r = si.radius;
                    addBoxToBins(x - r, y - r, z - r, x + r, y + r, z + r, bi);
                    break;
                case PLANE:
                    si.worldNormalNeedsUpdate && si.computeWorldNormal(bi.quaternion);
                    var planeNormal = si.worldNormal
                      , xreset = xmin + .5 * binsizeX - bi.position.x
                      , yreset = ymin + .5 * binsizeY - bi.position.y
                      , zreset = zmin + .5 * binsizeZ - bi.position.z
                      , d = GridBroadphase_collisionPairs_d;
                    d.set(xreset, yreset, zreset);
                    for (var xi = 0, xoff = 0; xi !== nx; xi++,
                    xoff += xstep,
                    d.y = yreset,
                    d.x += binsizeX)
                        for (var yi = 0, yoff = 0; yi !== ny; yi++,
                        yoff += ystep,
                        d.z = zreset,
                        d.y += binsizeY)
                            for (var zi = 0, zoff = 0; zi !== nz; zi++,
                            zoff += zstep,
                            d.z += binsizeZ)
                                if (d.dot(planeNormal) < binRadius) {
                                    var idx = xoff + yoff + zoff;
                                    bins[idx][binLengths[idx]++] = bi
                                }
                    break;
                default:
                    bi.aabbNeedsUpdate && bi.computeAABB(),
                    addBoxToBins(bi.aabb.lowerBound.x, bi.aabb.lowerBound.y, bi.aabb.lowerBound.z, bi.aabb.upperBound.x, bi.aabb.upperBound.y, bi.aabb.upperBound.z, bi)
                }
            }
            for (i = 0; i !== Nbins; i++) {
                var binLength = binLengths[i];
                if (binLength > 1)
                    for (var bin = bins[i], xi = 0; xi !== binLength; xi++)
                        for (var bi = bin[xi], yi = 0; yi !== xi; yi++) {
                            var bj = bin[yi];
                            this.needBroadphaseCollision(bi, bj) && this.intersectionTest(bi, bj, pairs1, pairs2)
                        }
            }
            this.makePairsUnique(pairs1, pairs2)
        }
    }
    , {
        "../math/Vec3": 33,
        "../shapes/Shape": 46,
        "./Broadphase": 7
    }],
    9: [function(require, module, exports) {
        function NaiveBroadphase() {
            Broadphase.apply(this)
        }
        module.exports = NaiveBroadphase;
        var Broadphase = require("./Broadphase")
          , AABB = require("./AABB");
        NaiveBroadphase.prototype = new Broadphase,
        NaiveBroadphase.prototype.constructor = NaiveBroadphase,
        NaiveBroadphase.prototype.collisionPairs = function(world, pairs1, pairs2) {
            var i, j, bi, bj, bodies = world.bodies, n = bodies.length;
            for (i = 0; i !== n; i++)
                for (j = 0; j !== i; j++)
                    bi = bodies[i],
                    bj = bodies[j],
                    this.needBroadphaseCollision(bi, bj) && this.intersectionTest(bi, bj, pairs1, pairs2)
        }
        ;
        new AABB;
        NaiveBroadphase.prototype.aabbQuery = function(world, aabb, result) {
            result = result || [];
            for (var i = 0; i < world.bodies.length; i++) {
                var b = world.bodies[i];
                b.aabbNeedsUpdate && b.computeAABB(),
                b.aabb.overlaps(aabb) && result.push(b)
            }
            return result
        }
    }
    , {
        "./AABB": 5,
        "./Broadphase": 7
    }],
    10: [function(require, module, exports) {
        function ObjectCollisionMatrix() {
            this.matrix = {}
        }
        module.exports = ObjectCollisionMatrix,
        ObjectCollisionMatrix.prototype.get = function(i, j) {
            if (i = i.id,
            (j = j.id) > i) {
                var temp = j;
                j = i,
                i = temp
            }
            return i + "-" + j in this.matrix
        }
        ,
        ObjectCollisionMatrix.prototype.set = function(i, j, value) {
            if (i = i.id,
            (j = j.id) > i) {
                var temp = j;
                j = i,
                i = temp
            }
            value ? this.matrix[i + "-" + j] = !0 : delete this.matrix[i + "-" + j]
        }
        ,
        ObjectCollisionMatrix.prototype.reset = function() {
            this.matrix = {}
        }
        ,
        ObjectCollisionMatrix.prototype.setNumObjects = function(n) {}
    }
    , {}],
    11: [function(require, module, exports) {
        function OverlapKeeper() {
            this.current = [],
            this.previous = []
        }
        function unpackAndPush(array, key) {
            array.push((4294901760 & key) >> 16, 65535 & key)
        }
        module.exports = OverlapKeeper,
        OverlapKeeper.prototype.getKey = function(i, j) {
            if (j < i) {
                var temp = j;
                j = i,
                i = temp
            }
            return i << 16 | j
        }
        ,
        OverlapKeeper.prototype.set = function(i, j) {
            for (var key = this.getKey(i, j), current = this.current, index = 0; key > current[index]; )
                index++;
            if (key !== current[index]) {
                for (var j = current.length - 1; j >= index; j--)
                    current[j + 1] = current[j];
                current[index] = key
            }
        }
        ,
        OverlapKeeper.prototype.tick = function() {
            var tmp = this.current;
            this.current = this.previous,
            this.previous = tmp,
            this.current.length = 0
        }
        ,
        OverlapKeeper.prototype.getDiff = function(additions, removals) {
            for (var a = this.current, b = this.previous, al = a.length, bl = b.length, j = 0, i = 0; i < al; i++) {
                for (var keyA = a[i]; keyA > b[j]; )
                    j++;
                keyA === b[j] || unpackAndPush(additions, keyA)
            }
            j = 0;
            for (i = 0; i < bl; i++) {
                for (var keyB = b[i]; keyB > a[j]; )
                    j++;
                a[j] === keyB || unpackAndPush(removals, keyB)
            }
        }
    }
    , {}],
    12: [function(require, module, exports) {
        function Ray(from, to) {
            this.from = from ? from.clone() : new Vec3,
            this.to = to ? to.clone() : new Vec3,
            this._direction = new Vec3,
            this.precision = 1e-4,
            this.checkCollisionResponse = !0,
            this.skipBackfaces = !1,
            this.collisionFilterMask = -1,
            this.collisionFilterGroup = -1,
            this.mode = Ray.ANY,
            this.result = new RaycastResult,
            this.hasHit = !1,
            this.callback = function(result) {}
        }
        function pointInTriangle(p, a, b, c) {
            c.vsub(a, v0),
            b.vsub(a, v1),
            p.vsub(a, v2);
            var u, v, dot00 = v0.dot(v0), dot01 = v0.dot(v1), dot02 = v0.dot(v2), dot11 = v1.dot(v1), dot12 = v1.dot(v2);
            return (u = dot11 * dot02 - dot01 * dot12) >= 0 && (v = dot00 * dot12 - dot01 * dot02) >= 0 && u + v < dot00 * dot11 - dot01 * dot01
        }
        function distanceFromIntersection(from, direction, position) {
            position.vsub(from, v0);
            var dot = v0.dot(direction);
            return direction.mult(dot, intersect),
            intersect.vadd(from, intersect),
            position.distanceTo(intersect)
        }
        module.exports = Ray;
        var Vec3 = require("../math/Vec3")
          , Quaternion = require("../math/Quaternion")
          , Transform = require("../math/Transform")
          , RaycastResult = (require("../shapes/ConvexPolyhedron"),
        require("../shapes/Box"),
        require("../collision/RaycastResult"))
          , Shape = require("../shapes/Shape")
          , AABB = require("../collision/AABB");
        Ray.prototype.constructor = Ray,
        Ray.CLOSEST = 1,
        Ray.ANY = 2,
        Ray.ALL = 4;
        var tmpAABB = new AABB
          , tmpArray = [];
        Ray.prototype.intersectWorld = function(world, options) {
            return this.mode = options.mode || Ray.ANY,
            this.result = options.result || new RaycastResult,
            this.skipBackfaces = !!options.skipBackfaces,
            this.collisionFilterMask = void 0 !== options.collisionFilterMask ? options.collisionFilterMask : -1,
            this.collisionFilterGroup = void 0 !== options.collisionFilterGroup ? options.collisionFilterGroup : -1,
            options.from && this.from.copy(options.from),
            options.to && this.to.copy(options.to),
            this.callback = options.callback || function() {}
            ,
            this.hasHit = !1,
            this.result.reset(),
            this._updateDirection(),
            this.getAABB(tmpAABB),
            tmpArray.length = 0,
            world.broadphase.aabbQuery(world, tmpAABB, tmpArray),
            this.intersectBodies(tmpArray),
            this.hasHit
        }
        ;
        var v1 = new Vec3
          , v2 = new Vec3;
        Ray.pointInTriangle = pointInTriangle;
        var intersectBody_xi = new Vec3
          , intersectBody_qi = new Quaternion;
        Ray.prototype.intersectBody = function(body, result) {
            result && (this.result = result,
            this._updateDirection());
            var checkCollisionResponse = this.checkCollisionResponse;
            if ((!checkCollisionResponse || body.collisionResponse) && 0 != (this.collisionFilterGroup & body.collisionFilterMask) && 0 != (body.collisionFilterGroup & this.collisionFilterMask))
                for (var xi = intersectBody_xi, qi = intersectBody_qi, i = 0, N = body.shapes.length; i < N; i++) {
                    var shape = body.shapes[i];
                    if ((!checkCollisionResponse || shape.collisionResponse) && (body.quaternion.mult(body.shapeOrientations[i], qi),
                    body.quaternion.vmult(body.shapeOffsets[i], xi),
                    xi.vadd(body.position, xi),
                    this.intersectShape(shape, qi, xi, body),
                    this.result._shouldStop))
                        break
                }
        }
        ,
        Ray.prototype.intersectBodies = function(bodies, result) {
            result && (this.result = result,
            this._updateDirection());
            for (var i = 0, l = bodies.length; !this.result._shouldStop && i < l; i++)
                this.intersectBody(bodies[i])
        }
        ,
        Ray.prototype._updateDirection = function() {
            this.to.vsub(this.from, this._direction),
            this._direction.normalize()
        }
        ,
        Ray.prototype.intersectShape = function(shape, quat, position, body) {
            if (!(distanceFromIntersection(this.from, this._direction, position) > shape.boundingSphereRadius)) {
                var intersectMethod = this[shape.type];
                intersectMethod && intersectMethod.call(this, shape, quat, position, body, shape)
            }
        }
        ;
        new Vec3,
        new Vec3;
        var intersectPoint = new Vec3
          , a = new Vec3
          , b = new Vec3
          , c = new Vec3;
        new Vec3,
        new RaycastResult;
        Ray.prototype.intersectBox = function(shape, quat, position, body, reportedShape) {
            return this.intersectConvex(shape.convexPolyhedronRepresentation, quat, position, body, reportedShape)
        }
        ,
        Ray.prototype[Shape.types.BOX] = Ray.prototype.intersectBox,
        Ray.prototype.intersectPlane = function(shape, quat, position, body, reportedShape) {
            var from = this.from
              , to = this.to
              , direction = this._direction
              , worldNormal = new Vec3(0,0,1);
            quat.vmult(worldNormal, worldNormal);
            var len = new Vec3;
            from.vsub(position, len);
            var planeToFrom = len.dot(worldNormal);
            if (to.vsub(position, len),
            !(planeToFrom * len.dot(worldNormal) > 0 || from.distanceTo(to) < planeToFrom)) {
                var n_dot_dir = worldNormal.dot(direction);
                if (!(Math.abs(n_dot_dir) < this.precision)) {
                    var planePointToFrom = new Vec3
                      , dir_scaled_with_t = new Vec3
                      , hitPointWorld = new Vec3;
                    from.vsub(position, planePointToFrom);
                    var t = -worldNormal.dot(planePointToFrom) / n_dot_dir;
                    direction.scale(t, dir_scaled_with_t),
                    from.vadd(dir_scaled_with_t, hitPointWorld),
                    this.reportIntersection(worldNormal, hitPointWorld, reportedShape, body, -1)
                }
            }
        }
        ,
        Ray.prototype[Shape.types.PLANE] = Ray.prototype.intersectPlane,
        Ray.prototype.getAABB = function(result) {
            var to = this.to
              , from = this.from;
            result.lowerBound.x = Math.min(to.x, from.x),
            result.lowerBound.y = Math.min(to.y, from.y),
            result.lowerBound.z = Math.min(to.z, from.z),
            result.upperBound.x = Math.max(to.x, from.x),
            result.upperBound.y = Math.max(to.y, from.y),
            result.upperBound.z = Math.max(to.z, from.z)
        }
        ;
        var intersectConvexOptions = {
            faceList: [0]
        }
          , worldPillarOffset = new Vec3
          , intersectHeightfield_localRay = new Ray
          , intersectHeightfield_index = [];
        Ray.prototype.intersectHeightfield = function(shape, quat, position, body, reportedShape) {
            shape.data,
            shape.elementSize;
            var localRay = intersectHeightfield_localRay;
            localRay.from.copy(this.from),
            localRay.to.copy(this.to),
            Transform.pointToLocalFrame(position, quat, localRay.from, localRay.from),
            Transform.pointToLocalFrame(position, quat, localRay.to, localRay.to),
            localRay._updateDirection();
            var iMinX, iMinY, iMaxX, iMaxY, index = intersectHeightfield_index;
            iMinX = iMinY = 0,
            iMaxX = iMaxY = shape.data.length - 1;
            var aabb = new AABB;
            localRay.getAABB(aabb),
            shape.getIndexOfPosition(aabb.lowerBound.x, aabb.lowerBound.y, index, !0),
            iMinX = Math.max(iMinX, index[0]),
            iMinY = Math.max(iMinY, index[1]),
            shape.getIndexOfPosition(aabb.upperBound.x, aabb.upperBound.y, index, !0),
            iMaxX = Math.min(iMaxX, index[0] + 1),
            iMaxY = Math.min(iMaxY, index[1] + 1);
            for (var i = iMinX; i < iMaxX; i++)
                for (var j = iMinY; j < iMaxY; j++) {
                    if (this.result._shouldStop)
                        return;
                    if (shape.getAabbAtIndex(i, j, aabb),
                    aabb.overlapsRay(localRay)) {
                        if (shape.getConvexTrianglePillar(i, j, !1),
                        Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset),
                        this.intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions),
                        this.result._shouldStop)
                            return;
                        shape.getConvexTrianglePillar(i, j, !0),
                        Transform.pointToWorldFrame(position, quat, shape.pillarOffset, worldPillarOffset),
                        this.intersectConvex(shape.pillarConvex, quat, worldPillarOffset, body, reportedShape, intersectConvexOptions)
                    }
                }
        }
        ,
        Ray.prototype[Shape.types.HEIGHTFIELD] = Ray.prototype.intersectHeightfield;
        var Ray_intersectSphere_intersectionPoint = new Vec3
          , Ray_intersectSphere_normal = new Vec3;
        Ray.prototype.intersectSphere = function(shape, quat, position, body, reportedShape) {
            var from = this.from
              , to = this.to
              , r = shape.radius
              , a = Math.pow(to.x - from.x, 2) + Math.pow(to.y - from.y, 2) + Math.pow(to.z - from.z, 2)
              , b = 2 * ((to.x - from.x) * (from.x - position.x) + (to.y - from.y) * (from.y - position.y) + (to.z - from.z) * (from.z - position.z))
              , c = Math.pow(from.x - position.x, 2) + Math.pow(from.y - position.y, 2) + Math.pow(from.z - position.z, 2) - Math.pow(r, 2)
              , delta = Math.pow(b, 2) - 4 * a * c
              , intersectionPoint = Ray_intersectSphere_intersectionPoint
              , normal = Ray_intersectSphere_normal;
            if (!(delta < 0))
                if (0 === delta)
                    from.lerp(to, delta, intersectionPoint),
                    intersectionPoint.vsub(position, normal),
                    normal.normalize(),
                    this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1);
                else {
                    var d1 = (-b - Math.sqrt(delta)) / (2 * a)
                      , d2 = (-b + Math.sqrt(delta)) / (2 * a);
                    if (d1 >= 0 && d1 <= 1 && (from.lerp(to, d1, intersectionPoint),
                    intersectionPoint.vsub(position, normal),
                    normal.normalize(),
                    this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1)),
                    this.result._shouldStop)
                        return;
                    d2 >= 0 && d2 <= 1 && (from.lerp(to, d2, intersectionPoint),
                    intersectionPoint.vsub(position, normal),
                    normal.normalize(),
                    this.reportIntersection(normal, intersectionPoint, reportedShape, body, -1))
                }
        }
        ,
        Ray.prototype[Shape.types.SPHERE] = Ray.prototype.intersectSphere;
        var intersectConvex_normal = new Vec3
          , intersectConvex_vector = (new Vec3,
        new Vec3,
        new Vec3);
        Ray.prototype.intersectConvex = function(shape, quat, position, body, reportedShape, options) {
            for (var normal = intersectConvex_normal, vector = intersectConvex_vector, faceList = options && options.faceList || null, faces = shape.faces, vertices = shape.vertices, normals = shape.faceNormals, direction = this._direction, from = this.from, to = this.to, fromToDistance = from.distanceTo(to), Nfaces = faceList ? faceList.length : faces.length, result = this.result, j = 0; !result._shouldStop && j < Nfaces; j++) {
                var fi = faceList ? faceList[j] : j
                  , face = faces[fi]
                  , faceNormal = normals[fi]
                  , q = quat
                  , x = position;
                vector.copy(vertices[face[0]]),
                q.vmult(vector, vector),
                vector.vadd(x, vector),
                vector.vsub(from, vector),
                q.vmult(faceNormal, normal);
                var dot = direction.dot(normal);
                if (!(Math.abs(dot) < this.precision)) {
                    var scalar = normal.dot(vector) / dot;
                    if (!(scalar < 0)) {
                        direction.mult(scalar, intersectPoint),
                        intersectPoint.vadd(from, intersectPoint),
                        a.copy(vertices[face[0]]),
                        q.vmult(a, a),
                        x.vadd(a, a);
                        for (var i = 1; !result._shouldStop && i < face.length - 1; i++) {
                            b.copy(vertices[face[i]]),
                            c.copy(vertices[face[i + 1]]),
                            q.vmult(b, b),
                            q.vmult(c, c),
                            x.vadd(b, b),
                            x.vadd(c, c);
                            var distance = intersectPoint.distanceTo(from);
                            !pointInTriangle(intersectPoint, a, b, c) && !pointInTriangle(intersectPoint, b, a, c) || distance > fromToDistance || this.reportIntersection(normal, intersectPoint, reportedShape, body, fi)
                        }
                    }
                }
            }
        }
        ,
        Ray.prototype[Shape.types.CONVEXPOLYHEDRON] = Ray.prototype.intersectConvex;
        var intersectTrimesh_normal = new Vec3
          , intersectTrimesh_localDirection = new Vec3
          , intersectTrimesh_localFrom = new Vec3
          , intersectTrimesh_localTo = new Vec3
          , intersectTrimesh_worldNormal = new Vec3
          , intersectTrimesh_worldIntersectPoint = new Vec3
          , intersectTrimesh_triangles = (new AABB,
        [])
          , intersectTrimesh_treeTransform = new Transform;
        Ray.prototype.intersectTrimesh = function(mesh, quat, position, body, reportedShape, options) {
            var normal = intersectTrimesh_normal
              , triangles = intersectTrimesh_triangles
              , treeTransform = intersectTrimesh_treeTransform
              , vector = intersectConvex_vector
              , localDirection = intersectTrimesh_localDirection
              , localFrom = intersectTrimesh_localFrom
              , localTo = intersectTrimesh_localTo
              , worldIntersectPoint = intersectTrimesh_worldIntersectPoint
              , worldNormal = intersectTrimesh_worldNormal
              , indices = (options && options.faceList,
            mesh.indices)
              , from = (mesh.vertices,
            mesh.faceNormals,
            this.from)
              , to = this.to
              , direction = this._direction;
            treeTransform.position.copy(position),
            treeTransform.quaternion.copy(quat),
            Transform.vectorToLocalFrame(position, quat, direction, localDirection),
            Transform.pointToLocalFrame(position, quat, from, localFrom),
            Transform.pointToLocalFrame(position, quat, to, localTo),
            localTo.x *= mesh.scale.x,
            localTo.y *= mesh.scale.y,
            localTo.z *= mesh.scale.z,
            localFrom.x *= mesh.scale.x,
            localFrom.y *= mesh.scale.y,
            localFrom.z *= mesh.scale.z,
            localTo.vsub(localFrom, localDirection),
            localDirection.normalize();
            var fromToDistanceSquared = localFrom.distanceSquared(localTo);
            mesh.tree.rayQuery(this, treeTransform, triangles);
            for (var i = 0, N = triangles.length; !this.result._shouldStop && i !== N; i++) {
                var trianglesIndex = triangles[i];
                mesh.getNormal(trianglesIndex, normal),
                mesh.getVertex(indices[3 * trianglesIndex], a),
                a.vsub(localFrom, vector);
                var dot = localDirection.dot(normal)
                  , scalar = normal.dot(vector) / dot;
                if (!(scalar < 0)) {
                    localDirection.scale(scalar, intersectPoint),
                    intersectPoint.vadd(localFrom, intersectPoint),
                    mesh.getVertex(indices[3 * trianglesIndex + 1], b),
                    mesh.getVertex(indices[3 * trianglesIndex + 2], c);
                    var squaredDistance = intersectPoint.distanceSquared(localFrom);
                    !pointInTriangle(intersectPoint, b, a, c) && !pointInTriangle(intersectPoint, a, b, c) || squaredDistance > fromToDistanceSquared || (Transform.vectorToWorldFrame(quat, normal, worldNormal),
                    Transform.pointToWorldFrame(position, quat, intersectPoint, worldIntersectPoint),
                    this.reportIntersection(worldNormal, worldIntersectPoint, reportedShape, body, trianglesIndex))
                }
            }
            triangles.length = 0
        }
        ,
        Ray.prototype[Shape.types.TRIMESH] = Ray.prototype.intersectTrimesh,
        Ray.prototype.reportIntersection = function(normal, hitPointWorld, shape, body, hitFaceIndex) {
            var from = this.from
              , to = this.to
              , distance = from.distanceTo(hitPointWorld)
              , result = this.result;
            if (!(this.skipBackfaces && normal.dot(this._direction) > 0))
                switch (result.hitFaceIndex = void 0 !== hitFaceIndex ? hitFaceIndex : -1,
                this.mode) {
                case Ray.ALL:
                    this.hasHit = !0,
                    result.set(from, to, normal, hitPointWorld, shape, body, distance),
                    result.hasHit = !0,
                    this.callback(result);
                    break;
                case Ray.CLOSEST:
                    (distance < result.distance || !result.hasHit) && (this.hasHit = !0,
                    result.hasHit = !0,
                    result.set(from, to, normal, hitPointWorld, shape, body, distance));
                    break;
                case Ray.ANY:
                    this.hasHit = !0,
                    result.hasHit = !0,
                    result.set(from, to, normal, hitPointWorld, shape, body, distance),
                    result._shouldStop = !0
                }
        }
        ;
        var v0 = new Vec3
          , intersect = new Vec3
    }
    , {
        "../collision/AABB": 5,
        "../collision/RaycastResult": 13,
        "../math/Quaternion": 31,
        "../math/Transform": 32,
        "../math/Vec3": 33,
        "../shapes/Box": 40,
        "../shapes/ConvexPolyhedron": 41,
        "../shapes/Shape": 46
    }],
    13: [function(require, module, exports) {
        function RaycastResult() {
            this.rayFromWorld = new Vec3,
            this.rayToWorld = new Vec3,
            this.hitNormalWorld = new Vec3,
            this.hitPointWorld = new Vec3,
            this.hasHit = !1,
            this.shape = null,
            this.body = null,
            this.hitFaceIndex = -1,
            this.distance = -1,
            this._shouldStop = !1
        }
        var Vec3 = require("../math/Vec3");
        module.exports = RaycastResult,
        RaycastResult.prototype.reset = function() {
            this.rayFromWorld.setZero(),
            this.rayToWorld.setZero(),
            this.hitNormalWorld.setZero(),
            this.hitPointWorld.setZero(),
            this.hasHit = !1,
            this.shape = null,
            this.body = null,
            this.hitFaceIndex = -1,
            this.distance = -1,
            this._shouldStop = !1
        }
        ,
        RaycastResult.prototype.abort = function() {
            this._shouldStop = !0
        }
        ,
        RaycastResult.prototype.set = function(rayFromWorld, rayToWorld, hitNormalWorld, hitPointWorld, shape, body, distance) {
            this.rayFromWorld.copy(rayFromWorld),
            this.rayToWorld.copy(rayToWorld),
            this.hitNormalWorld.copy(hitNormalWorld),
            this.hitPointWorld.copy(hitPointWorld),
            this.shape = shape,
            this.body = body,
            this.distance = distance
        }
    }
    , {
        "../math/Vec3": 33
    }],
    14: [function(require, module, exports) {
        function SAPBroadphase(world) {
            Broadphase.apply(this),
            this.axisList = [],
            this.world = null,
            this.axisIndex = 0;
            var axisList = this.axisList;
            this._addBodyHandler = function(e) {
                axisList.push(e.body)
            }
            ,
            this._removeBodyHandler = function(e) {
                var idx = axisList.indexOf(e.body);
                -1 !== idx && axisList.splice(idx, 1)
            }
            ,
            world && this.setWorld(world)
        }
        require("../shapes/Shape");
        var Broadphase = require("../collision/Broadphase");
        module.exports = SAPBroadphase,
        SAPBroadphase.prototype = new Broadphase,
        SAPBroadphase.prototype.setWorld = function(world) {
            this.axisList.length = 0;
            for (var i = 0; i < world.bodies.length; i++)
                this.axisList.push(world.bodies[i]);
            world.removeEventListener("addBody", this._addBodyHandler),
            world.removeEventListener("removeBody", this._removeBodyHandler),
            world.addEventListener("addBody", this._addBodyHandler),
            world.addEventListener("removeBody", this._removeBodyHandler),
            this.world = world,
            this.dirty = !0
        }
        ,
        SAPBroadphase.insertionSortX = function(a) {
            for (var i = 1, l = a.length; i < l; i++) {
                for (var v = a[i], j = i - 1; j >= 0 && !(a[j].aabb.lowerBound.x <= v.aabb.lowerBound.x); j--)
                    a[j + 1] = a[j];
                a[j + 1] = v
            }
            return a
        }
        ,
        SAPBroadphase.insertionSortY = function(a) {
            for (var i = 1, l = a.length; i < l; i++) {
                for (var v = a[i], j = i - 1; j >= 0 && !(a[j].aabb.lowerBound.y <= v.aabb.lowerBound.y); j--)
                    a[j + 1] = a[j];
                a[j + 1] = v
            }
            return a
        }
        ,
        SAPBroadphase.insertionSortZ = function(a) {
            for (var i = 1, l = a.length; i < l; i++) {
                for (var v = a[i], j = i - 1; j >= 0 && !(a[j].aabb.lowerBound.z <= v.aabb.lowerBound.z); j--)
                    a[j + 1] = a[j];
                a[j + 1] = v
            }
            return a
        }
        ,
        SAPBroadphase.prototype.collisionPairs = function(world, p1, p2) {
            var i, j, bodies = this.axisList, N = bodies.length, axisIndex = this.axisIndex;
            for (this.dirty && (this.sortList(),
            this.dirty = !1),
            i = 0; i !== N; i++) {
                var bi = bodies[i];
                for (j = i + 1; j < N; j++) {
                    var bj = bodies[j];
                    if (this.needBroadphaseCollision(bi, bj)) {
                        if (!SAPBroadphase.checkBounds(bi, bj, axisIndex))
                            break;
                        this.intersectionTest(bi, bj, p1, p2)
                    }
                }
            }
        }
        ,
        SAPBroadphase.prototype.sortList = function() {
            for (var axisList = this.axisList, axisIndex = this.axisIndex, N = axisList.length, i = 0; i !== N; i++) {
                var bi = axisList[i];
                bi.aabbNeedsUpdate && bi.computeAABB()
            }
            0 === axisIndex ? SAPBroadphase.insertionSortX(axisList) : 1 === axisIndex ? SAPBroadphase.insertionSortY(axisList) : 2 === axisIndex && SAPBroadphase.insertionSortZ(axisList)
        }
        ,
        SAPBroadphase.checkBounds = function(bi, bj, axisIndex) {
            var biPos, bjPos;
            0 === axisIndex ? (biPos = bi.position.x,
            bjPos = bj.position.x) : 1 === axisIndex ? (biPos = bi.position.y,
            bjPos = bj.position.y) : 2 === axisIndex && (biPos = bi.position.z,
            bjPos = bj.position.z);
            var ri = bi.boundingRadius
              , rj = bj.boundingRadius;
            return bjPos - rj < biPos + ri
        }
        ,
        SAPBroadphase.prototype.autoDetectAxis = function() {
            for (var sumX = 0, sumX2 = 0, sumY = 0, sumY2 = 0, sumZ = 0, sumZ2 = 0, bodies = this.axisList, N = bodies.length, invN = 1 / N, i = 0; i !== N; i++) {
                var b = bodies[i]
                  , centerX = b.position.x;
                sumX += centerX,
                sumX2 += centerX * centerX;
                var centerY = b.position.y;
                sumY += centerY,
                sumY2 += centerY * centerY;
                var centerZ = b.position.z;
                sumZ += centerZ,
                sumZ2 += centerZ * centerZ
            }
            var varianceX = sumX2 - sumX * sumX * invN
              , varianceY = sumY2 - sumY * sumY * invN
              , varianceZ = sumZ2 - sumZ * sumZ * invN;
            this.axisIndex = varianceX > varianceY ? varianceX > varianceZ ? 0 : 2 : varianceY > varianceZ ? 1 : 2
        }
        ,
        SAPBroadphase.prototype.aabbQuery = function(world, aabb, result) {
            result = result || [],
            this.dirty && (this.sortList(),
            this.dirty = !1);
            var axisIndex = this.axisIndex
              , axis = "x";
            1 === axisIndex && (axis = "y"),
            2 === axisIndex && (axis = "z");
            for (var axisList = this.axisList, i = (aabb.lowerBound[axis],
            aabb.upperBound[axis],
            0); i < axisList.length; i++) {
                var b = axisList[i];
                b.aabbNeedsUpdate && b.computeAABB(),
                b.aabb.overlaps(aabb) && result.push(b)
            }
            return result
        }
    }
    , {
        "../collision/Broadphase": 7,
        "../shapes/Shape": 46
    }],
    15: [function(require, module, exports) {
        function ConeTwistConstraint(bodyA, bodyB, options) {
            var maxForce = void 0 !== (options = options || {}).maxForce ? options.maxForce : 1e6
              , pivotA = options.pivotA ? options.pivotA.clone() : new Vec3
              , pivotB = options.pivotB ? options.pivotB.clone() : new Vec3;
            this.axisA = options.axisA ? options.axisA.clone() : new Vec3,
            this.axisB = options.axisB ? options.axisB.clone() : new Vec3,
            PointToPointConstraint.call(this, bodyA, pivotA, bodyB, pivotB, maxForce),
            this.collideConnected = !!options.collideConnected,
            this.angle = void 0 !== options.angle ? options.angle : 0;
            var c = this.coneEquation = new ConeEquation(bodyA,bodyB,options)
              , t = this.twistEquation = new RotationalEquation(bodyA,bodyB,options);
            this.twistAngle = void 0 !== options.twistAngle ? options.twistAngle : 0,
            c.maxForce = 0,
            c.minForce = -maxForce,
            t.maxForce = 0,
            t.minForce = -maxForce,
            this.equations.push(c, t)
        }
        module.exports = ConeTwistConstraint;
        require("./Constraint");
        var PointToPointConstraint = require("./PointToPointConstraint")
          , ConeEquation = require("../equations/ConeEquation")
          , RotationalEquation = require("../equations/RotationalEquation")
          , Vec3 = (require("../equations/ContactEquation"),
        require("../math/Vec3"));
        ConeTwistConstraint.prototype = new PointToPointConstraint,
        ConeTwistConstraint.constructor = ConeTwistConstraint;
        new Vec3,
        new Vec3;
        ConeTwistConstraint.prototype.update = function() {
            var bodyA = this.bodyA
              , bodyB = this.bodyB
              , cone = this.coneEquation
              , twist = this.twistEquation;
            PointToPointConstraint.prototype.update.call(this),
            bodyA.vectorToWorldFrame(this.axisA, cone.axisA),
            bodyB.vectorToWorldFrame(this.axisB, cone.axisB),
            this.axisA.tangents(twist.axisA, twist.axisA),
            bodyA.vectorToWorldFrame(twist.axisA, twist.axisA),
            this.axisB.tangents(twist.axisB, twist.axisB),
            bodyB.vectorToWorldFrame(twist.axisB, twist.axisB),
            cone.angle = this.angle,
            twist.maxAngle = this.twistAngle
        }
    }
    , {
        "../equations/ConeEquation": 21,
        "../equations/ContactEquation": 22,
        "../equations/RotationalEquation": 25,
        "../math/Vec3": 33,
        "./Constraint": 16,
        "./PointToPointConstraint": 20
    }],
    16: [function(require, module, exports) {
        function Constraint(bodyA, bodyB, options) {
            options = Utils.defaults(options, {
                collideConnected: !0,
                wakeUpBodies: !0
            }),
            this.equations = [],
            this.bodyA = bodyA,
            this.bodyB = bodyB,
            this.id = Constraint.idCounter++,
            this.collideConnected = options.collideConnected,
            options.wakeUpBodies && (bodyA && bodyA.wakeUp(),
            bodyB && bodyB.wakeUp())
        }
        module.exports = Constraint;
        var Utils = require("../utils/Utils");
        Constraint.prototype.update = function() {
            throw new Error("method update() not implmemented in this Constraint subclass!")
        }
        ,
        Constraint.prototype.enable = function() {
            for (var eqs = this.equations, i = 0; i < eqs.length; i++)
                eqs[i].enabled = !0
        }
        ,
        Constraint.prototype.disable = function() {
            for (var eqs = this.equations, i = 0; i < eqs.length; i++)
                eqs[i].enabled = !1
        }
        ,
        Constraint.idCounter = 0
    }
    , {
        "../utils/Utils": 56
    }],
    17: [function(require, module, exports) {
        function DistanceConstraint(bodyA, bodyB, distance, maxForce) {
            Constraint.call(this, bodyA, bodyB),
            void 0 === distance && (distance = bodyA.position.distanceTo(bodyB.position)),
            void 0 === maxForce && (maxForce = 1e6),
            this.distance = distance;
            var eq = this.distanceEquation = new ContactEquation(bodyA,bodyB);
            this.equations.push(eq),
            eq.minForce = -maxForce,
            eq.maxForce = maxForce
        }
        module.exports = DistanceConstraint;
        var Constraint = require("./Constraint")
          , ContactEquation = require("../equations/ContactEquation");
        DistanceConstraint.prototype = new Constraint,
        DistanceConstraint.prototype.update = function() {
            var bodyA = this.bodyA
              , bodyB = this.bodyB
              , eq = this.distanceEquation
              , halfDist = .5 * this.distance
              , normal = eq.ni;
            bodyB.position.vsub(bodyA.position, normal),
            normal.normalize(),
            normal.mult(halfDist, eq.ri),
            normal.mult(-halfDist, eq.rj)
        }
    }
    , {
        "../equations/ContactEquation": 22,
        "./Constraint": 16
    }],
    18: [function(require, module, exports) {
        function HingeConstraint(bodyA, bodyB, options) {
            var maxForce = void 0 !== (options = options || {}).maxForce ? options.maxForce : 1e6
              , pivotA = options.pivotA ? options.pivotA.clone() : new Vec3
              , pivotB = options.pivotB ? options.pivotB.clone() : new Vec3;
            PointToPointConstraint.call(this, bodyA, pivotA, bodyB, pivotB, maxForce),
            (this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1,0,0)).normalize(),
            (this.axisB = options.axisB ? options.axisB.clone() : new Vec3(1,0,0)).normalize();
            var r1 = this.rotationalEquation1 = new RotationalEquation(bodyA,bodyB,options)
              , r2 = this.rotationalEquation2 = new RotationalEquation(bodyA,bodyB,options)
              , motor = this.motorEquation = new RotationalMotorEquation(bodyA,bodyB,maxForce);
            motor.enabled = !1,
            this.equations.push(r1, r2, motor)
        }
        module.exports = HingeConstraint;
        require("./Constraint");
        var PointToPointConstraint = require("./PointToPointConstraint")
          , RotationalEquation = require("../equations/RotationalEquation")
          , RotationalMotorEquation = require("../equations/RotationalMotorEquation")
          , Vec3 = (require("../equations/ContactEquation"),
        require("../math/Vec3"));
        HingeConstraint.prototype = new PointToPointConstraint,
        HingeConstraint.constructor = HingeConstraint,
        HingeConstraint.prototype.enableMotor = function() {
            this.motorEquation.enabled = !0
        }
        ,
        HingeConstraint.prototype.disableMotor = function() {
            this.motorEquation.enabled = !1
        }
        ,
        HingeConstraint.prototype.setMotorSpeed = function(speed) {
            this.motorEquation.targetVelocity = speed
        }
        ,
        HingeConstraint.prototype.setMotorMaxForce = function(maxForce) {
            this.motorEquation.maxForce = maxForce,
            this.motorEquation.minForce = -maxForce
        }
        ;
        var HingeConstraint_update_tmpVec1 = new Vec3
          , HingeConstraint_update_tmpVec2 = new Vec3;
        HingeConstraint.prototype.update = function() {
            var bodyA = this.bodyA
              , bodyB = this.bodyB
              , motor = this.motorEquation
              , r1 = this.rotationalEquation1
              , r2 = this.rotationalEquation2
              , worldAxisA = HingeConstraint_update_tmpVec1
              , worldAxisB = HingeConstraint_update_tmpVec2
              , axisA = this.axisA
              , axisB = this.axisB;
            PointToPointConstraint.prototype.update.call(this),
            bodyA.quaternion.vmult(axisA, worldAxisA),
            bodyB.quaternion.vmult(axisB, worldAxisB),
            worldAxisA.tangents(r1.axisA, r2.axisA),
            r1.axisB.copy(worldAxisB),
            r2.axisB.copy(worldAxisB),
            this.motorEquation.enabled && (bodyA.quaternion.vmult(this.axisA, motor.axisA),
            bodyB.quaternion.vmult(this.axisB, motor.axisB))
        }
    }
    , {
        "../equations/ContactEquation": 22,
        "../equations/RotationalEquation": 25,
        "../equations/RotationalMotorEquation": 26,
        "../math/Vec3": 33,
        "./Constraint": 16,
        "./PointToPointConstraint": 20
    }],
    19: [function(require, module, exports) {
        function LockConstraint(bodyA, bodyB, options) {
            var maxForce = void 0 !== (options = options || {}).maxForce ? options.maxForce : 1e6
              , pivotA = new Vec3
              , pivotB = new Vec3
              , halfWay = new Vec3;
            bodyA.position.vadd(bodyB.position, halfWay),
            halfWay.scale(.5, halfWay),
            bodyB.pointToLocalFrame(halfWay, pivotB),
            bodyA.pointToLocalFrame(halfWay, pivotA),
            PointToPointConstraint.call(this, bodyA, pivotA, bodyB, pivotB, maxForce),
            this.xA = bodyA.vectorToLocalFrame(Vec3.UNIT_X),
            this.xB = bodyB.vectorToLocalFrame(Vec3.UNIT_X),
            this.yA = bodyA.vectorToLocalFrame(Vec3.UNIT_Y),
            this.yB = bodyB.vectorToLocalFrame(Vec3.UNIT_Y),
            this.zA = bodyA.vectorToLocalFrame(Vec3.UNIT_Z),
            this.zB = bodyB.vectorToLocalFrame(Vec3.UNIT_Z);
            var r1 = this.rotationalEquation1 = new RotationalEquation(bodyA,bodyB,options)
              , r2 = this.rotationalEquation2 = new RotationalEquation(bodyA,bodyB,options)
              , r3 = this.rotationalEquation3 = new RotationalEquation(bodyA,bodyB,options);
            this.equations.push(r1, r2, r3)
        }
        module.exports = LockConstraint;
        require("./Constraint");
        var PointToPointConstraint = require("./PointToPointConstraint")
          , RotationalEquation = require("../equations/RotationalEquation")
          , Vec3 = (require("../equations/RotationalMotorEquation"),
        require("../equations/ContactEquation"),
        require("../math/Vec3"));
        LockConstraint.prototype = new PointToPointConstraint,
        LockConstraint.constructor = LockConstraint;
        new Vec3,
        new Vec3;
        LockConstraint.prototype.update = function() {
            var bodyA = this.bodyA
              , bodyB = this.bodyB
              , r1 = (this.motorEquation,
            this.rotationalEquation1)
              , r2 = this.rotationalEquation2
              , r3 = this.rotationalEquation3;
            PointToPointConstraint.prototype.update.call(this),
            bodyA.vectorToWorldFrame(this.xA, r1.axisA),
            bodyB.vectorToWorldFrame(this.yB, r1.axisB),
            bodyA.vectorToWorldFrame(this.yA, r2.axisA),
            bodyB.vectorToWorldFrame(this.zB, r2.axisB),
            bodyA.vectorToWorldFrame(this.zA, r3.axisA),
            bodyB.vectorToWorldFrame(this.xB, r3.axisB)
        }
    }
    , {
        "../equations/ContactEquation": 22,
        "../equations/RotationalEquation": 25,
        "../equations/RotationalMotorEquation": 26,
        "../math/Vec3": 33,
        "./Constraint": 16,
        "./PointToPointConstraint": 20
    }],
    20: [function(require, module, exports) {
        function PointToPointConstraint(bodyA, pivotA, bodyB, pivotB, maxForce) {
            Constraint.call(this, bodyA, bodyB),
            maxForce = void 0 !== maxForce ? maxForce : 1e6,
            this.pivotA = pivotA ? pivotA.clone() : new Vec3,
            this.pivotB = pivotB ? pivotB.clone() : new Vec3;
            var x = this.equationX = new ContactEquation(bodyA,bodyB)
              , y = this.equationY = new ContactEquation(bodyA,bodyB)
              , z = this.equationZ = new ContactEquation(bodyA,bodyB);
            this.equations.push(x, y, z),
            x.minForce = y.minForce = z.minForce = -maxForce,
            x.maxForce = y.maxForce = z.maxForce = maxForce,
            x.ni.set(1, 0, 0),
            y.ni.set(0, 1, 0),
            z.ni.set(0, 0, 1)
        }
        module.exports = PointToPointConstraint;
        var Constraint = require("./Constraint")
          , ContactEquation = require("../equations/ContactEquation")
          , Vec3 = require("../math/Vec3");
        PointToPointConstraint.prototype = new Constraint,
        PointToPointConstraint.prototype.update = function() {
            var bodyA = this.bodyA
              , bodyB = this.bodyB
              , x = this.equationX
              , y = this.equationY
              , z = this.equationZ;
            bodyA.quaternion.vmult(this.pivotA, x.ri),
            bodyB.quaternion.vmult(this.pivotB, x.rj),
            y.ri.copy(x.ri),
            y.rj.copy(x.rj),
            z.ri.copy(x.ri),
            z.rj.copy(x.rj)
        }
    }
    , {
        "../equations/ContactEquation": 22,
        "../math/Vec3": 33,
        "./Constraint": 16
    }],
    21: [function(require, module, exports) {
        function ConeEquation(bodyA, bodyB, options) {
            var maxForce = void 0 !== (options = options || {}).maxForce ? options.maxForce : 1e6;
            Equation.call(this, bodyA, bodyB, -maxForce, maxForce),
            this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1,0,0),
            this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0,1,0),
            this.angle = void 0 !== options.angle ? options.angle : 0
        }
        module.exports = ConeEquation;
        var Vec3 = require("../math/Vec3")
          , Equation = (require("../math/Mat3"),
        require("./Equation"));
        ConeEquation.prototype = new Equation,
        ConeEquation.prototype.constructor = ConeEquation;
        var tmpVec1 = new Vec3
          , tmpVec2 = new Vec3;
        ConeEquation.prototype.computeB = function(h) {
            var a = this.a
              , b = this.b
              , ni = this.axisA
              , nj = this.axisB
              , nixnj = tmpVec1
              , njxni = tmpVec2
              , GA = this.jacobianElementA
              , GB = this.jacobianElementB;
            return ni.cross(nj, nixnj),
            nj.cross(ni, njxni),
            GA.rotational.copy(njxni),
            GB.rotational.copy(nixnj),
            -(Math.cos(this.angle) - ni.dot(nj)) * a - this.computeGW() * b - h * this.computeGiMf()
        }
    }
    , {
        "../math/Mat3": 30,
        "../math/Vec3": 33,
        "./Equation": 23
    }],
    22: [function(require, module, exports) {
        function ContactEquation(bodyA, bodyB, maxForce) {
            maxForce = void 0 !== maxForce ? maxForce : 1e6,
            Equation.call(this, bodyA, bodyB, 0, maxForce),
            this.restitution = 0,
            this.ri = new Vec3,
            this.rj = new Vec3,
            this.ni = new Vec3
        }
        module.exports = ContactEquation;
        var Equation = require("./Equation")
          , Vec3 = require("../math/Vec3");
        require("../math/Mat3");
        ContactEquation.prototype = new Equation,
        ContactEquation.prototype.constructor = ContactEquation;
        var ContactEquation_computeB_temp1 = new Vec3
          , ContactEquation_computeB_temp2 = new Vec3
          , ContactEquation_computeB_temp3 = new Vec3;
        ContactEquation.prototype.computeB = function(h) {
            var a = this.a
              , b = this.b
              , bi = this.bi
              , bj = this.bj
              , ri = this.ri
              , rj = this.rj
              , rixn = ContactEquation_computeB_temp1
              , rjxn = ContactEquation_computeB_temp2
              , vi = bi.velocity
              , wi = bi.angularVelocity
              , vj = (bi.force,
            bi.torque,
            bj.velocity)
              , wj = bj.angularVelocity
              , penetrationVec = (bj.force,
            bj.torque,
            ContactEquation_computeB_temp3)
              , GA = this.jacobianElementA
              , GB = this.jacobianElementB
              , n = this.ni;
            ri.cross(n, rixn),
            rj.cross(n, rjxn),
            n.negate(GA.spatial),
            rixn.negate(GA.rotational),
            GB.spatial.copy(n),
            GB.rotational.copy(rjxn),
            penetrationVec.copy(bj.position),
            penetrationVec.vadd(rj, penetrationVec),
            penetrationVec.vsub(bi.position, penetrationVec),
            penetrationVec.vsub(ri, penetrationVec);
            var g = n.dot(penetrationVec)
              , ePlusOne = this.restitution + 1;
            return -g * a - (ePlusOne * vj.dot(n) - ePlusOne * vi.dot(n) + wj.dot(rjxn) - wi.dot(rixn)) * b - h * this.computeGiMf()
        }
        ;
        var ContactEquation_getImpactVelocityAlongNormal_vi = new Vec3
          , ContactEquation_getImpactVelocityAlongNormal_vj = new Vec3
          , ContactEquation_getImpactVelocityAlongNormal_xi = new Vec3
          , ContactEquation_getImpactVelocityAlongNormal_xj = new Vec3
          , ContactEquation_getImpactVelocityAlongNormal_relVel = new Vec3;
        ContactEquation.prototype.getImpactVelocityAlongNormal = function() {
            var vi = ContactEquation_getImpactVelocityAlongNormal_vi
              , vj = ContactEquation_getImpactVelocityAlongNormal_vj
              , xi = ContactEquation_getImpactVelocityAlongNormal_xi
              , xj = ContactEquation_getImpactVelocityAlongNormal_xj
              , relVel = ContactEquation_getImpactVelocityAlongNormal_relVel;
            return this.bi.position.vadd(this.ri, xi),
            this.bj.position.vadd(this.rj, xj),
            this.bi.getVelocityAtWorldPoint(xi, vi),
            this.bj.getVelocityAtWorldPoint(xj, vj),
            vi.vsub(vj, relVel),
            this.ni.dot(relVel)
        }
    }
    , {
        "../math/Mat3": 30,
        "../math/Vec3": 33,
        "./Equation": 23
    }],
    23: [function(require, module, exports) {
        function Equation(bi, bj, minForce, maxForce) {
            this.id = Equation.id++,
            this.minForce = void 0 === minForce ? -1e6 : minForce,
            this.maxForce = void 0 === maxForce ? 1e6 : maxForce,
            this.bi = bi,
            this.bj = bj,
            this.a = 0,
            this.b = 0,
            this.eps = 0,
            this.jacobianElementA = new JacobianElement,
            this.jacobianElementB = new JacobianElement,
            this.enabled = !0,
            this.multiplier = 0,
            this.setSpookParams(1e7, 4, 1 / 60)
        }
        module.exports = Equation;
        var JacobianElement = require("../math/JacobianElement")
          , Vec3 = require("../math/Vec3");
        Equation.prototype.constructor = Equation,
        Equation.id = 0,
        Equation.prototype.setSpookParams = function(stiffness, relaxation, timeStep) {
            var d = relaxation
              , k = stiffness
              , h = timeStep;
            this.a = 4 / (h * (1 + 4 * d)),
            this.b = 4 * d / (1 + 4 * d),
            this.eps = 4 / (h * h * k * (1 + 4 * d))
        }
        ,
        Equation.prototype.computeB = function(a, b, h) {
            var GW = this.computeGW();
            return -this.computeGq() * a - GW * b - this.computeGiMf() * h
        }
        ,
        Equation.prototype.computeGq = function() {
            var GA = this.jacobianElementA
              , GB = this.jacobianElementB
              , bi = this.bi
              , bj = this.bj
              , xi = bi.position
              , xj = bj.position;
            return GA.spatial.dot(xi) + GB.spatial.dot(xj)
        }
        ;
        new Vec3;
        Equation.prototype.computeGW = function() {
            var GA = this.jacobianElementA
              , GB = this.jacobianElementB
              , bi = this.bi
              , bj = this.bj
              , vi = bi.velocity
              , vj = bj.velocity
              , wi = bi.angularVelocity
              , wj = bj.angularVelocity;
            return GA.multiplyVectors(vi, wi) + GB.multiplyVectors(vj, wj)
        }
        ,
        Equation.prototype.computeGWlambda = function() {
            var GA = this.jacobianElementA
              , GB = this.jacobianElementB
              , bi = this.bi
              , bj = this.bj
              , vi = bi.vlambda
              , vj = bj.vlambda
              , wi = bi.wlambda
              , wj = bj.wlambda;
            return GA.multiplyVectors(vi, wi) + GB.multiplyVectors(vj, wj)
        }
        ;
        var iMfi = new Vec3
          , iMfj = new Vec3
          , invIi_vmult_taui = new Vec3
          , invIj_vmult_tauj = new Vec3;
        Equation.prototype.computeGiMf = function() {
            var GA = this.jacobianElementA
              , GB = this.jacobianElementB
              , bi = this.bi
              , bj = this.bj
              , fi = bi.force
              , ti = bi.torque
              , fj = bj.force
              , tj = bj.torque
              , invMassi = bi.invMassSolve
              , invMassj = bj.invMassSolve;
            return fi.scale(invMassi, iMfi),
            fj.scale(invMassj, iMfj),
            bi.invInertiaWorldSolve.vmult(ti, invIi_vmult_taui),
            bj.invInertiaWorldSolve.vmult(tj, invIj_vmult_tauj),
            GA.multiplyVectors(iMfi, invIi_vmult_taui) + GB.multiplyVectors(iMfj, invIj_vmult_tauj)
        }
        ;
        var tmp = new Vec3;
        Equation.prototype.computeGiMGt = function() {
            var GA = this.jacobianElementA
              , GB = this.jacobianElementB
              , bi = this.bi
              , bj = this.bj
              , invMassi = bi.invMassSolve
              , invMassj = bj.invMassSolve
              , invIi = bi.invInertiaWorldSolve
              , invIj = bj.invInertiaWorldSolve
              , result = invMassi + invMassj;
            return invIi.vmult(GA.rotational, tmp),
            result += tmp.dot(GA.rotational),
            invIj.vmult(GB.rotational, tmp),
            result += tmp.dot(GB.rotational)
        }
        ;
        var addToWlambda_temp = new Vec3;
        new Vec3,
        new Vec3,
        new Vec3,
        new Vec3,
        new Vec3;
        Equation.prototype.addToWlambda = function(deltalambda) {
            var GA = this.jacobianElementA
              , GB = this.jacobianElementB
              , bi = this.bi
              , bj = this.bj
              , temp = addToWlambda_temp;
            bi.vlambda.addScaledVector(bi.invMassSolve * deltalambda, GA.spatial, bi.vlambda),
            bj.vlambda.addScaledVector(bj.invMassSolve * deltalambda, GB.spatial, bj.vlambda),
            bi.invInertiaWorldSolve.vmult(GA.rotational, temp),
            bi.wlambda.addScaledVector(deltalambda, temp, bi.wlambda),
            bj.invInertiaWorldSolve.vmult(GB.rotational, temp),
            bj.wlambda.addScaledVector(deltalambda, temp, bj.wlambda)
        }
        ,
        Equation.prototype.computeC = function() {
            return this.computeGiMGt() + this.eps
        }
    }
    , {
        "../math/JacobianElement": 29,
        "../math/Vec3": 33
    }],
    24: [function(require, module, exports) {
        function FrictionEquation(bodyA, bodyB, slipForce) {
            Equation.call(this, bodyA, bodyB, -slipForce, slipForce),
            this.ri = new Vec3,
            this.rj = new Vec3,
            this.t = new Vec3
        }
        module.exports = FrictionEquation;
        var Equation = require("./Equation")
          , Vec3 = require("../math/Vec3");
        require("../math/Mat3");
        FrictionEquation.prototype = new Equation,
        FrictionEquation.prototype.constructor = FrictionEquation;
        var FrictionEquation_computeB_temp1 = new Vec3
          , FrictionEquation_computeB_temp2 = new Vec3;
        FrictionEquation.prototype.computeB = function(h) {
            this.a;
            var b = this.b
              , ri = (this.bi,
            this.bj,
            this.ri)
              , rj = this.rj
              , rixt = FrictionEquation_computeB_temp1
              , rjxt = FrictionEquation_computeB_temp2
              , t = this.t;
            ri.cross(t, rixt),
            rj.cross(t, rjxt);
            var GA = this.jacobianElementA
              , GB = this.jacobianElementB;
            return t.negate(GA.spatial),
            rixt.negate(GA.rotational),
            GB.spatial.copy(t),
            GB.rotational.copy(rjxt),
            -this.computeGW() * b - h * this.computeGiMf()
        }
    }
    , {
        "../math/Mat3": 30,
        "../math/Vec3": 33,
        "./Equation": 23
    }],
    25: [function(require, module, exports) {
        function RotationalEquation(bodyA, bodyB, options) {
            var maxForce = void 0 !== (options = options || {}).maxForce ? options.maxForce : 1e6;
            Equation.call(this, bodyA, bodyB, -maxForce, maxForce),
            this.axisA = options.axisA ? options.axisA.clone() : new Vec3(1,0,0),
            this.axisB = options.axisB ? options.axisB.clone() : new Vec3(0,1,0),
            this.maxAngle = Math.PI / 2
        }
        module.exports = RotationalEquation;
        var Vec3 = require("../math/Vec3")
          , Equation = (require("../math/Mat3"),
        require("./Equation"));
        RotationalEquation.prototype = new Equation,
        RotationalEquation.prototype.constructor = RotationalEquation;
        var tmpVec1 = new Vec3
          , tmpVec2 = new Vec3;
        RotationalEquation.prototype.computeB = function(h) {
            var a = this.a
              , b = this.b
              , ni = this.axisA
              , nj = this.axisB
              , nixnj = tmpVec1
              , njxni = tmpVec2
              , GA = this.jacobianElementA
              , GB = this.jacobianElementB;
            return ni.cross(nj, nixnj),
            nj.cross(ni, njxni),
            GA.rotational.copy(njxni),
            GB.rotational.copy(nixnj),
            -(Math.cos(this.maxAngle) - ni.dot(nj)) * a - this.computeGW() * b - h * this.computeGiMf()
        }
    }
    , {
        "../math/Mat3": 30,
        "../math/Vec3": 33,
        "./Equation": 23
    }],
    26: [function(require, module, exports) {
        function RotationalMotorEquation(bodyA, bodyB, maxForce) {
            maxForce = void 0 !== maxForce ? maxForce : 1e6,
            Equation.call(this, bodyA, bodyB, -maxForce, maxForce),
            this.axisA = new Vec3,
            this.axisB = new Vec3,
            this.targetVelocity = 0
        }
        module.exports = RotationalMotorEquation;
        var Vec3 = require("../math/Vec3")
          , Equation = (require("../math/Mat3"),
        require("./Equation"));
        RotationalMotorEquation.prototype = new Equation,
        RotationalMotorEquation.prototype.constructor = RotationalMotorEquation,
        RotationalMotorEquation.prototype.computeB = function(h) {
            this.a;
            var b = this.b
              , axisA = (this.bi,
            this.bj,
            this.axisA)
              , axisB = this.axisB
              , GA = this.jacobianElementA
              , GB = this.jacobianElementB;
            return GA.rotational.copy(axisA),
            axisB.negate(GB.rotational),
            -(this.computeGW() - this.targetVelocity) * b - h * this.computeGiMf()
        }
    }
    , {
        "../math/Mat3": 30,
        "../math/Vec3": 33,
        "./Equation": 23
    }],
    27: [function(require, module, exports) {
        function ContactMaterial(m1, m2, options) {
            options = Utils.defaults(options, {
                friction: .3,
                restitution: .3,
                contactEquationStiffness: 1e7,
                contactEquationRelaxation: 3,
                frictionEquationStiffness: 1e7,
                frictionEquationRelaxation: 3
            }),
            this.id = ContactMaterial.idCounter++,
            this.materials = [m1, m2],
            this.friction = options.friction,
            this.restitution = options.restitution,
            this.contactEquationStiffness = options.contactEquationStiffness,
            this.contactEquationRelaxation = options.contactEquationRelaxation,
            this.frictionEquationStiffness = options.frictionEquationStiffness,
            this.frictionEquationRelaxation = options.frictionEquationRelaxation
        }
        var Utils = require("../utils/Utils");
        module.exports = ContactMaterial,
        ContactMaterial.idCounter = 0
    }
    , {
        "../utils/Utils": 56
    }],
    28: [function(require, module, exports) {
        function Material(options) {
            var name = "";
            "string" == typeof (options = options || {}) ? (name = options,
            options = {}) : "object" == typeof options && (name = ""),
            this.name = name,
            this.id = Material.idCounter++,
            this.friction = void 0 !== options.friction ? options.friction : -1,
            this.restitution = void 0 !== options.restitution ? options.restitution : -1
        }
        module.exports = Material,
        Material.idCounter = 0
    }
    , {}],
    29: [function(require, module, exports) {
        function JacobianElement() {
            this.spatial = new Vec3,
            this.rotational = new Vec3
        }
        module.exports = JacobianElement;
        var Vec3 = require("./Vec3");
        JacobianElement.prototype.multiplyElement = function(element) {
            return element.spatial.dot(this.spatial) + element.rotational.dot(this.rotational)
        }
        ,
        JacobianElement.prototype.multiplyVectors = function(spatial, rotational) {
            return spatial.dot(this.spatial) + rotational.dot(this.rotational)
        }
    }
    , {
        "./Vec3": 33
    }],
    30: [function(require, module, exports) {
        function Mat3(elements) {
            this.elements = elements || [0, 0, 0, 0, 0, 0, 0, 0, 0]
        }
        module.exports = Mat3;
        var Vec3 = require("./Vec3");
        Mat3.prototype.identity = function() {
            var e = this.elements;
            e[0] = 1,
            e[1] = 0,
            e[2] = 0,
            e[3] = 0,
            e[4] = 1,
            e[5] = 0,
            e[6] = 0,
            e[7] = 0,
            e[8] = 1
        }
        ,
        Mat3.prototype.setZero = function() {
            var e = this.elements;
            e[0] = 0,
            e[1] = 0,
            e[2] = 0,
            e[3] = 0,
            e[4] = 0,
            e[5] = 0,
            e[6] = 0,
            e[7] = 0,
            e[8] = 0
        }
        ,
        Mat3.prototype.setTrace = function(vec3) {
            var e = this.elements;
            e[0] = vec3.x,
            e[4] = vec3.y,
            e[8] = vec3.z
        }
        ,
        Mat3.prototype.getTrace = function(target) {
            var target = target || new Vec3
              , e = this.elements;
            target.x = e[0],
            target.y = e[4],
            target.z = e[8]
        }
        ,
        Mat3.prototype.vmult = function(v, target) {
            target = target || new Vec3;
            var e = this.elements
              , x = v.x
              , y = v.y
              , z = v.z;
            return target.x = e[0] * x + e[1] * y + e[2] * z,
            target.y = e[3] * x + e[4] * y + e[5] * z,
            target.z = e[6] * x + e[7] * y + e[8] * z,
            target
        }
        ,
        Mat3.prototype.smult = function(s) {
            for (var i = 0; i < this.elements.length; i++)
                this.elements[i] *= s
        }
        ,
        Mat3.prototype.mmult = function(m, target) {
            for (var r = target || new Mat3, i = 0; i < 3; i++)
                for (var j = 0; j < 3; j++) {
                    for (var sum = 0, k = 0; k < 3; k++)
                        sum += m.elements[i + 3 * k] * this.elements[k + 3 * j];
                    r.elements[i + 3 * j] = sum
                }
            return r
        }
        ,
        Mat3.prototype.scale = function(v, target) {
            target = target || new Mat3;
            for (var e = this.elements, t = target.elements, i = 0; 3 !== i; i++)
                t[3 * i + 0] = v.x * e[3 * i + 0],
                t[3 * i + 1] = v.y * e[3 * i + 1],
                t[3 * i + 2] = v.z * e[3 * i + 2];
            return target
        }
        ,
        Mat3.prototype.solve = function(b, target) {
            target = target || new Vec3;
            for (var eqns = [], i = 0; i < 12; i++)
                eqns.push(0);
            var j;
            for (i = 0; i < 3; i++)
                for (j = 0; j < 3; j++)
                    eqns[i + 4 * j] = this.elements[i + 3 * j];
            eqns[3] = b.x,
            eqns[7] = b.y,
            eqns[11] = b.z;
            var np, p, n = 3, k = n;
            do {
                if (i = k - n,
                0 === eqns[i + 4 * i])
                    for (j = i + 1; j < k; j++)
                        if (0 !== eqns[i + 4 * j]) {
                            np = 4;
                            do {
                                eqns[(p = 4 - np) + 4 * i] += eqns[p + 4 * j]
                            } while (--np);
                            break
                        }
                if (0 !== eqns[i + 4 * i])
                    for (j = i + 1; j < k; j++) {
                        var multiplier = eqns[i + 4 * j] / eqns[i + 4 * i];
                        np = 4;
                        do {
                            eqns[(p = 4 - np) + 4 * j] = p <= i ? 0 : eqns[p + 4 * j] - eqns[p + 4 * i] * multiplier
                        } while (--np)
                    }
            } while (--n);
            if (target.z = eqns[11] / eqns[10],
            target.y = (eqns[7] - eqns[6] * target.z) / eqns[5],
            target.x = (eqns[3] - eqns[2] * target.z - eqns[1] * target.y) / eqns[0],
            isNaN(target.x) || isNaN(target.y) || isNaN(target.z) || target.x === 1 / 0 || target.y === 1 / 0 || target.z === 1 / 0)
                throw "Could not solve equation! Got x=[" + target.toString() + "], b=[" + b.toString() + "], A=[" + this.toString() + "]";
            return target
        }
        ,
        Mat3.prototype.e = function(row, column, value) {
            if (void 0 === value)
                return this.elements[column + 3 * row];
            this.elements[column + 3 * row] = value
        }
        ,
        Mat3.prototype.copy = function(source) {
            for (var i = 0; i < source.elements.length; i++)
                this.elements[i] = source.elements[i];
            return this
        }
        ,
        Mat3.prototype.toString = function() {
            for (var r = "", i = 0; i < 9; i++)
                r += this.elements[i] + ",";
            return r
        }
        ,
        Mat3.prototype.reverse = function(target) {
            target = target || new Mat3;
            for (var eqns = [], i = 0; i < 18; i++)
                eqns.push(0);
            var j;
            for (i = 0; i < 3; i++)
                for (j = 0; j < 3; j++)
                    eqns[i + 6 * j] = this.elements[i + 3 * j];
            eqns[3] = 1,
            eqns[9] = 0,
            eqns[15] = 0,
            eqns[4] = 0,
            eqns[10] = 1,
            eqns[16] = 0,
            eqns[5] = 0,
            eqns[11] = 0,
            eqns[17] = 1;
            var np, p, n = 3, k = n;
            do {
                if (i = k - n,
                0 === eqns[i + 6 * i])
                    for (j = i + 1; j < k; j++)
                        if (0 !== eqns[i + 6 * j]) {
                            np = 6;
                            do {
                                eqns[(p = 6 - np) + 6 * i] += eqns[p + 6 * j]
                            } while (--np);
                            break
                        }
                if (0 !== eqns[i + 6 * i])
                    for (j = i + 1; j < k; j++) {
                        multiplier = eqns[i + 6 * j] / eqns[i + 6 * i];
                        np = 6;
                        do {
                            eqns[(p = 6 - np) + 6 * j] = p <= i ? 0 : eqns[p + 6 * j] - eqns[p + 6 * i] * multiplier
                        } while (--np)
                    }
            } while (--n);
            i = 2;
            do {
                j = i - 1;
                do {
                    multiplier = eqns[i + 6 * j] / eqns[i + 6 * i];
                    np = 6;
                    do {
                        eqns[(p = 6 - np) + 6 * j] = eqns[p + 6 * j] - eqns[p + 6 * i] * multiplier
                    } while (--np)
                } while (j--)
            } while (--i);
            i = 2;
            do {
                var multiplier = 1 / eqns[i + 6 * i];
                np = 6;
                do {
                    eqns[(p = 6 - np) + 6 * i] = eqns[p + 6 * i] * multiplier
                } while (--np)
            } while (i--);
            i = 2;
            do {
                j = 2;
                do {
                    if (p = eqns[3 + j + 6 * i],
                    isNaN(p) || p === 1 / 0)
                        throw "Could not reverse! A=[" + this.toString() + "]";
                    target.e(i, j, p)
                } while (j--)
            } while (i--);
            return target
        }
        ,
        Mat3.prototype.setRotationFromQuaternion = function(q) {
            var x = q.x
              , y = q.y
              , z = q.z
              , w = q.w
              , x2 = x + x
              , y2 = y + y
              , z2 = z + z
              , xx = x * x2
              , xy = x * y2
              , xz = x * z2
              , yy = y * y2
              , yz = y * z2
              , zz = z * z2
              , wx = w * x2
              , wy = w * y2
              , wz = w * z2
              , e = this.elements;
            return e[0] = 1 - (yy + zz),
            e[1] = xy - wz,
            e[2] = xz + wy,
            e[3] = xy + wz,
            e[4] = 1 - (xx + zz),
            e[5] = yz - wx,
            e[6] = xz - wy,
            e[7] = yz + wx,
            e[8] = 1 - (xx + yy),
            this
        }
        ,
        Mat3.prototype.transpose = function(target) {
            for (var Mt = (target = target || new Mat3).elements, M = this.elements, i = 0; 3 !== i; i++)
                for (var j = 0; 3 !== j; j++)
                    Mt[3 * i + j] = M[3 * j + i];
            return target
        }
    }
    , {
        "./Vec3": 33
    }],
    31: [function(require, module, exports) {
        function Quaternion(x, y, z, w) {
            this.x = void 0 !== x ? x : 0,
            this.y = void 0 !== y ? y : 0,
            this.z = void 0 !== z ? z : 0,
            this.w = void 0 !== w ? w : 1
        }
        module.exports = Quaternion;
        var Vec3 = require("./Vec3");
        Quaternion.prototype.set = function(x, y, z, w) {
            return this.x = x,
            this.y = y,
            this.z = z,
            this.w = w,
            this
        }
        ,
        Quaternion.prototype.toString = function() {
            return this.x + "," + this.y + "," + this.z + "," + this.w
        }
        ,
        Quaternion.prototype.toArray = function() {
            return [this.x, this.y, this.z, this.w]
        }
        ,
        Quaternion.prototype.setFromAxisAngle = function(axis, angle) {
            var s = Math.sin(.5 * angle);
            return this.x = axis.x * s,
            this.y = axis.y * s,
            this.z = axis.z * s,
            this.w = Math.cos(.5 * angle),
            this
        }
        ,
        Quaternion.prototype.toAxisAngle = function(targetAxis) {
            targetAxis = targetAxis || new Vec3,
            this.normalize();
            var angle = 2 * Math.acos(this.w)
              , s = Math.sqrt(1 - this.w * this.w);
            return s < .001 ? (targetAxis.x = this.x,
            targetAxis.y = this.y,
            targetAxis.z = this.z) : (targetAxis.x = this.x / s,
            targetAxis.y = this.y / s,
            targetAxis.z = this.z / s),
            [targetAxis, angle]
        }
        ;
        var sfv_t1 = new Vec3
          , sfv_t2 = new Vec3;
        Quaternion.prototype.setFromVectors = function(u, v) {
            if (u.isAntiparallelTo(v)) {
                var t1 = sfv_t1
                  , t2 = sfv_t2;
                u.tangents(t1, t2),
                this.setFromAxisAngle(t1, Math.PI)
            } else {
                var a = u.cross(v);
                this.x = a.x,
                this.y = a.y,
                this.z = a.z,
                this.w = Math.sqrt(Math.pow(u.norm(), 2) * Math.pow(v.norm(), 2)) + u.dot(v),
                this.normalize()
            }
            return this
        }
        ;
        new Vec3,
        new Vec3,
        new Vec3;
        Quaternion.prototype.mult = function(q, target) {
            target = target || new Quaternion;
            var ax = this.x
              , ay = this.y
              , az = this.z
              , aw = this.w
              , bx = q.x
              , by = q.y
              , bz = q.z
              , bw = q.w;
            return target.x = ax * bw + aw * bx + ay * bz - az * by,
            target.y = ay * bw + aw * by + az * bx - ax * bz,
            target.z = az * bw + aw * bz + ax * by - ay * bx,
            target.w = aw * bw - ax * bx - ay * by - az * bz,
            target
        }
        ,
        Quaternion.prototype.inverse = function(target) {
            var x = this.x
              , y = this.y
              , z = this.z
              , w = this.w;
            target = target || new Quaternion,
            this.conjugate(target);
            var inorm2 = 1 / (x * x + y * y + z * z + w * w);
            return target.x *= inorm2,
            target.y *= inorm2,
            target.z *= inorm2,
            target.w *= inorm2,
            target
        }
        ,
        Quaternion.prototype.conjugate = function(target) {
            return target = target || new Quaternion,
            target.x = -this.x,
            target.y = -this.y,
            target.z = -this.z,
            target.w = this.w,
            target
        }
        ,
        Quaternion.prototype.normalize = function() {
            var l = Math.sqrt(this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w);
            return 0 === l ? (this.x = 0,
            this.y = 0,
            this.z = 0,
            this.w = 0) : (l = 1 / l,
            this.x *= l,
            this.y *= l,
            this.z *= l,
            this.w *= l),
            this
        }
        ,
        Quaternion.prototype.normalizeFast = function() {
            var f = (3 - (this.x * this.x + this.y * this.y + this.z * this.z + this.w * this.w)) / 2;
            return 0 === f ? (this.x = 0,
            this.y = 0,
            this.z = 0,
            this.w = 0) : (this.x *= f,
            this.y *= f,
            this.z *= f,
            this.w *= f),
            this
        }
        ,
        Quaternion.prototype.vmult = function(v, target) {
            target = target || new Vec3;
            var x = v.x
              , y = v.y
              , z = v.z
              , qx = this.x
              , qy = this.y
              , qz = this.z
              , qw = this.w
              , ix = qw * x + qy * z - qz * y
              , iy = qw * y + qz * x - qx * z
              , iz = qw * z + qx * y - qy * x
              , iw = -qx * x - qy * y - qz * z;
            return target.x = ix * qw + iw * -qx + iy * -qz - iz * -qy,
            target.y = iy * qw + iw * -qy + iz * -qx - ix * -qz,
            target.z = iz * qw + iw * -qz + ix * -qy - iy * -qx,
            target
        }
        ,
        Quaternion.prototype.copy = function(source) {
            return this.x = source.x,
            this.y = source.y,
            this.z = source.z,
            this.w = source.w,
            this
        }
        ,
        Quaternion.prototype.toEuler = function(target, order) {
            order = order || "YZX";
            var heading, attitude, bank, x = this.x, y = this.y, z = this.z, w = this.w;
            switch (order) {
            case "YZX":
                var test = x * y + z * w;
                if (test > .499 && (heading = 2 * Math.atan2(x, w),
                attitude = Math.PI / 2,
                bank = 0),
                test < -.499 && (heading = -2 * Math.atan2(x, w),
                attitude = -Math.PI / 2,
                bank = 0),
                isNaN(heading)) {
                    var sqx = x * x
                      , sqy = y * y
                      , sqz = z * z;
                    heading = Math.atan2(2 * y * w - 2 * x * z, 1 - 2 * sqy - 2 * sqz),
                    attitude = Math.asin(2 * test),
                    bank = Math.atan2(2 * x * w - 2 * y * z, 1 - 2 * sqx - 2 * sqz)
                }
                break;
            default:
                throw new Error("Euler order " + order + " not supported yet.")
            }
            target.y = heading,
            target.z = attitude,
            target.x = bank
        }
        ,
        Quaternion.prototype.setFromEuler = function(x, y, z, order) {
            order = order || "XYZ";
            var c1 = Math.cos(x / 2)
              , c2 = Math.cos(y / 2)
              , c3 = Math.cos(z / 2)
              , s1 = Math.sin(x / 2)
              , s2 = Math.sin(y / 2)
              , s3 = Math.sin(z / 2);
            return "XYZ" === order ? (this.x = s1 * c2 * c3 + c1 * s2 * s3,
            this.y = c1 * s2 * c3 - s1 * c2 * s3,
            this.z = c1 * c2 * s3 + s1 * s2 * c3,
            this.w = c1 * c2 * c3 - s1 * s2 * s3) : "YXZ" === order ? (this.x = s1 * c2 * c3 + c1 * s2 * s3,
            this.y = c1 * s2 * c3 - s1 * c2 * s3,
            this.z = c1 * c2 * s3 - s1 * s2 * c3,
            this.w = c1 * c2 * c3 + s1 * s2 * s3) : "ZXY" === order ? (this.x = s1 * c2 * c3 - c1 * s2 * s3,
            this.y = c1 * s2 * c3 + s1 * c2 * s3,
            this.z = c1 * c2 * s3 + s1 * s2 * c3,
            this.w = c1 * c2 * c3 - s1 * s2 * s3) : "ZYX" === order ? (this.x = s1 * c2 * c3 - c1 * s2 * s3,
            this.y = c1 * s2 * c3 + s1 * c2 * s3,
            this.z = c1 * c2 * s3 - s1 * s2 * c3,
            this.w = c1 * c2 * c3 + s1 * s2 * s3) : "YZX" === order ? (this.x = s1 * c2 * c3 + c1 * s2 * s3,
            this.y = c1 * s2 * c3 + s1 * c2 * s3,
            this.z = c1 * c2 * s3 - s1 * s2 * c3,
            this.w = c1 * c2 * c3 - s1 * s2 * s3) : "XZY" === order && (this.x = s1 * c2 * c3 - c1 * s2 * s3,
            this.y = c1 * s2 * c3 - s1 * c2 * s3,
            this.z = c1 * c2 * s3 + s1 * s2 * c3,
            this.w = c1 * c2 * c3 + s1 * s2 * s3),
            this
        }
        ,
        Quaternion.prototype.clone = function() {
            return new Quaternion(this.x,this.y,this.z,this.w)
        }
        ,
        Quaternion.prototype.slerp = function(toQuat, t, target) {
            target = target || new Quaternion;
            var omega, cosom, sinom, scale0, scale1, ax = this.x, ay = this.y, az = this.z, aw = this.w, bx = toQuat.x, by = toQuat.y, bz = toQuat.z, bw = toQuat.w;
            return (cosom = ax * bx + ay * by + az * bz + aw * bw) < 0 && (cosom = -cosom,
            bx = -bx,
            by = -by,
            bz = -bz,
            bw = -bw),
            1 - cosom > 1e-6 ? (omega = Math.acos(cosom),
            sinom = Math.sin(omega),
            scale0 = Math.sin((1 - t) * omega) / sinom,
            scale1 = Math.sin(t * omega) / sinom) : (scale0 = 1 - t,
            scale1 = t),
            target.x = scale0 * ax + scale1 * bx,
            target.y = scale0 * ay + scale1 * by,
            target.z = scale0 * az + scale1 * bz,
            target.w = scale0 * aw + scale1 * bw,
            target
        }
        ,
        Quaternion.prototype.integrate = function(angularVelocity, dt, angularFactor, target) {
            target = target || new Quaternion;
            var ax = angularVelocity.x * angularFactor.x
              , ay = angularVelocity.y * angularFactor.y
              , az = angularVelocity.z * angularFactor.z
              , bx = this.x
              , by = this.y
              , bz = this.z
              , bw = this.w
              , half_dt = .5 * dt;
            return target.x += half_dt * (ax * bw + ay * bz - az * by),
            target.y += half_dt * (ay * bw + az * bx - ax * bz),
            target.z += half_dt * (az * bw + ax * by - ay * bx),
            target.w += half_dt * (-ax * bx - ay * by - az * bz),
            target
        }
    }
    , {
        "./Vec3": 33
    }],
    32: [function(require, module, exports) {
        function Transform(options) {
            options = options || {},
            this.position = new Vec3,
            options.position && this.position.copy(options.position),
            this.quaternion = new Quaternion,
            options.quaternion && this.quaternion.copy(options.quaternion)
        }
        var Vec3 = require("./Vec3")
          , Quaternion = require("./Quaternion");
        module.exports = Transform;
        var tmpQuat = new Quaternion;
        Transform.pointToLocalFrame = function(position, quaternion, worldPoint, result) {
            var result = result || new Vec3;
            return worldPoint.vsub(position, result),
            quaternion.conjugate(tmpQuat),
            tmpQuat.vmult(result, result),
            result
        }
        ,
        Transform.prototype.pointToLocal = function(worldPoint, result) {
            return Transform.pointToLocalFrame(this.position, this.quaternion, worldPoint, result)
        }
        ,
        Transform.pointToWorldFrame = function(position, quaternion, localPoint, result) {
            var result = result || new Vec3;
            return quaternion.vmult(localPoint, result),
            result.vadd(position, result),
            result
        }
        ,
        Transform.prototype.pointToWorld = function(localPoint, result) {
            return Transform.pointToWorldFrame(this.position, this.quaternion, localPoint, result)
        }
        ,
        Transform.prototype.vectorToWorldFrame = function(localVector, result) {
            var result = result || new Vec3;
            return this.quaternion.vmult(localVector, result),
            result
        }
        ,
        Transform.vectorToWorldFrame = function(quaternion, localVector, result) {
            return quaternion.vmult(localVector, result),
            result
        }
        ,
        Transform.vectorToLocalFrame = function(position, quaternion, worldVector, result) {
            var result = result || new Vec3;
            return quaternion.w *= -1,
            quaternion.vmult(worldVector, result),
            quaternion.w *= -1,
            result
        }
    }
    , {
        "./Quaternion": 31,
        "./Vec3": 33
    }],
    33: [function(require, module, exports) {
        function Vec3(x, y, z) {
            this.x = x || 0,
            this.y = y || 0,
            this.z = z || 0
        }
        module.exports = Vec3;
        var Mat3 = require("./Mat3");
        Vec3.ZERO = new Vec3(0,0,0),
        Vec3.UNIT_X = new Vec3(1,0,0),
        Vec3.UNIT_Y = new Vec3(0,1,0),
        Vec3.UNIT_Z = new Vec3(0,0,1),
        Vec3.prototype.cross = function(v, target) {
            var vx = v.x
              , vy = v.y
              , vz = v.z
              , x = this.x
              , y = this.y
              , z = this.z;
            return target = target || new Vec3,
            target.x = y * vz - z * vy,
            target.y = z * vx - x * vz,
            target.z = x * vy - y * vx,
            target
        }
        ,
        Vec3.prototype.set = function(x, y, z) {
            return this.x = x,
            this.y = y,
            this.z = z,
            this
        }
        ,
        Vec3.prototype.setZero = function() {
            this.x = this.y = this.z = 0
        }
        ,
        Vec3.prototype.vadd = function(v, target) {
            if (!target)
                return new Vec3(this.x + v.x,this.y + v.y,this.z + v.z);
            target.x = v.x + this.x,
            target.y = v.y + this.y,
            target.z = v.z + this.z
        }
        ,
        Vec3.prototype.vsub = function(v, target) {
            if (!target)
                return new Vec3(this.x - v.x,this.y - v.y,this.z - v.z);
            target.x = this.x - v.x,
            target.y = this.y - v.y,
            target.z = this.z - v.z
        }
        ,
        Vec3.prototype.crossmat = function() {
            return new Mat3([0, -this.z, this.y, this.z, 0, -this.x, -this.y, this.x, 0])
        }
        ,
        Vec3.prototype.normalize = function() {
            var x = this.x
              , y = this.y
              , z = this.z
              , n = Math.sqrt(x * x + y * y + z * z);
            if (n > 0) {
                var invN = 1 / n;
                this.x *= invN,
                this.y *= invN,
                this.z *= invN
            } else
                this.x = 0,
                this.y = 0,
                this.z = 0;
            return n
        }
        ,
        Vec3.prototype.unit = function(target) {
            target = target || new Vec3;
            var x = this.x
              , y = this.y
              , z = this.z
              , ninv = Math.sqrt(x * x + y * y + z * z);
            return ninv > 0 ? (ninv = 1 / ninv,
            target.x = x * ninv,
            target.y = y * ninv,
            target.z = z * ninv) : (target.x = 1,
            target.y = 0,
            target.z = 0),
            target
        }
        ,
        Vec3.prototype.norm = function() {
            var x = this.x
              , y = this.y
              , z = this.z;
            return Math.sqrt(x * x + y * y + z * z)
        }
        ,
        Vec3.prototype.length = Vec3.prototype.norm,
        Vec3.prototype.norm2 = function() {
            return this.dot(this)
        }
        ,
        Vec3.prototype.lengthSquared = Vec3.prototype.norm2,
        Vec3.prototype.distanceTo = function(p) {
            var x = this.x
              , y = this.y
              , z = this.z
              , px = p.x
              , py = p.y
              , pz = p.z;
            return Math.sqrt((px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z))
        }
        ,
        Vec3.prototype.distanceSquared = function(p) {
            var x = this.x
              , y = this.y
              , z = this.z
              , px = p.x
              , py = p.y
              , pz = p.z;
            return (px - x) * (px - x) + (py - y) * (py - y) + (pz - z) * (pz - z)
        }
        ,
        Vec3.prototype.mult = function(scalar, target) {
            target = target || new Vec3;
            var x = this.x
              , y = this.y
              , z = this.z;
            return target.x = scalar * x,
            target.y = scalar * y,
            target.z = scalar * z,
            target
        }
        ,
        Vec3.prototype.vmul = function(vector, target) {
            return target = target || new Vec3,
            target.x = vector.x * this.x,
            target.y = vector.y * this.y,
            target.z = vector.z * this.z,
            target
        }
        ,
        Vec3.prototype.scale = Vec3.prototype.mult,
        Vec3.prototype.addScaledVector = function(scalar, vector, target) {
            return target = target || new Vec3,
            target.x = this.x + scalar * vector.x,
            target.y = this.y + scalar * vector.y,
            target.z = this.z + scalar * vector.z,
            target
        }
        ,
        Vec3.prototype.dot = function(v) {
            return this.x * v.x + this.y * v.y + this.z * v.z
        }
        ,
        Vec3.prototype.isZero = function() {
            return 0 === this.x && 0 === this.y && 0 === this.z
        }
        ,
        Vec3.prototype.negate = function(target) {
            return target = target || new Vec3,
            target.x = -this.x,
            target.y = -this.y,
            target.z = -this.z,
            target
        }
        ;
        var Vec3_tangents_n = new Vec3
          , Vec3_tangents_randVec = new Vec3;
        Vec3.prototype.tangents = function(t1, t2) {
            var norm = this.norm();
            if (norm > 0) {
                var n = Vec3_tangents_n
                  , inorm = 1 / norm;
                n.set(this.x * inorm, this.y * inorm, this.z * inorm);
                var randVec = Vec3_tangents_randVec;
                Math.abs(n.x) < .9 ? (randVec.set(1, 0, 0),
                n.cross(randVec, t1)) : (randVec.set(0, 1, 0),
                n.cross(randVec, t1)),
                n.cross(t1, t2)
            } else
                t1.set(1, 0, 0),
                t2.set(0, 1, 0)
        }
        ,
        Vec3.prototype.toString = function() {
            return this.x + "," + this.y + "," + this.z
        }
        ,
        Vec3.prototype.toArray = function() {
            return [this.x, this.y, this.z]
        }
        ,
        Vec3.prototype.copy = function(source) {
            return this.x = source.x,
            this.y = source.y,
            this.z = source.z,
            this
        }
        ,
        Vec3.prototype.lerp = function(v, t, target) {
            var x = this.x
              , y = this.y
              , z = this.z;
            target.x = x + (v.x - x) * t,
            target.y = y + (v.y - y) * t,
            target.z = z + (v.z - z) * t
        }
        ,
        Vec3.prototype.almostEquals = function(v, precision) {
            return void 0 === precision && (precision = 1e-6),
            !(Math.abs(this.x - v.x) > precision || Math.abs(this.y - v.y) > precision || Math.abs(this.z - v.z) > precision)
        }
        ,
        Vec3.prototype.almostZero = function(precision) {
            return void 0 === precision && (precision = 1e-6),
            !(Math.abs(this.x) > precision || Math.abs(this.y) > precision || Math.abs(this.z) > precision)
        }
        ;
        var antip_neg = new Vec3;
        Vec3.prototype.isAntiparallelTo = function(v, precision) {
            return this.negate(antip_neg),
            antip_neg.almostEquals(v, precision)
        }
        ,
        Vec3.prototype.clone = function() {
            return new Vec3(this.x,this.y,this.z)
        }
    }
    , {
        "./Mat3": 30
    }],
    34: [function(require, module, exports) {
        function Body(options) {
            options = options || {},
            EventTarget.apply(this),
            this.id = Body.idCounter++,
            this.world = null,
            this.preStep = null,
            this.postStep = null,
            this.vlambda = new Vec3,
            this.collisionFilterGroup = "number" == typeof options.collisionFilterGroup ? options.collisionFilterGroup : 1,
            this.collisionFilterMask = "number" == typeof options.collisionFilterMask ? options.collisionFilterMask : 1,
            this.collisionResponse = !0,
            this.position = new Vec3,
            this.previousPosition = new Vec3,
            this.interpolatedPosition = new Vec3,
            this.initPosition = new Vec3,
            options.position && (this.position.copy(options.position),
            this.previousPosition.copy(options.position),
            this.interpolatedPosition.copy(options.position),
            this.initPosition.copy(options.position)),
            this.velocity = new Vec3,
            options.velocity && this.velocity.copy(options.velocity),
            this.initVelocity = new Vec3,
            this.force = new Vec3;
            var mass = "number" == typeof options.mass ? options.mass : 0;
            this.mass = mass,
            this.invMass = mass > 0 ? 1 / mass : 0,
            this.material = options.material || null,
            this.linearDamping = "number" == typeof options.linearDamping ? options.linearDamping : .01,
            this.type = mass <= 0 ? Body.STATIC : Body.DYNAMIC,
            typeof options.type == typeof Body.STATIC && (this.type = options.type),
            this.allowSleep = void 0 === options.allowSleep || options.allowSleep,
            this.sleepState = 0,
            this.sleepSpeedLimit = void 0 !== options.sleepSpeedLimit ? options.sleepSpeedLimit : .1,
            this.sleepTimeLimit = void 0 !== options.sleepTimeLimit ? options.sleepTimeLimit : 1,
            this.timeLastSleepy = 0,
            this._wakeUpAfterNarrowphase = !1,
            this.torque = new Vec3,
            this.quaternion = new Quaternion,
            this.initQuaternion = new Quaternion,
            this.previousQuaternion = new Quaternion,
            this.interpolatedQuaternion = new Quaternion,
            options.quaternion && (this.quaternion.copy(options.quaternion),
            this.initQuaternion.copy(options.quaternion),
            this.previousQuaternion.copy(options.quaternion),
            this.interpolatedQuaternion.copy(options.quaternion)),
            this.angularVelocity = new Vec3,
            options.angularVelocity && this.angularVelocity.copy(options.angularVelocity),
            this.initAngularVelocity = new Vec3,
            this.shapes = [],
            this.shapeOffsets = [],
            this.shapeOrientations = [],
            this.inertia = new Vec3,
            this.invInertia = new Vec3,
            this.invInertiaWorld = new Mat3,
            this.invMassSolve = 0,
            this.invInertiaSolve = new Vec3,
            this.invInertiaWorldSolve = new Mat3,
            this.fixedRotation = void 0 !== options.fixedRotation && options.fixedRotation,
            this.angularDamping = void 0 !== options.angularDamping ? options.angularDamping : .01,
            this.linearFactor = new Vec3(1,1,1),
            options.linearFactor && this.linearFactor.copy(options.linearFactor),
            this.angularFactor = new Vec3(1,1,1),
            options.angularFactor && this.angularFactor.copy(options.angularFactor),
            this.aabb = new AABB,
            this.aabbNeedsUpdate = !0,
            this.wlambda = new Vec3,
            options.shape && this.addShape(options.shape),
            this.updateMassProperties()
        }
        module.exports = Body;
        var EventTarget = require("../utils/EventTarget")
          , Vec3 = (require("../shapes/Shape"),
        require("../math/Vec3"))
          , Mat3 = require("../math/Mat3")
          , Quaternion = require("../math/Quaternion")
          , AABB = (require("../material/Material"),
        require("../collision/AABB"))
          , Box = require("../shapes/Box");
        Body.prototype = new EventTarget,
        Body.prototype.constructor = Body,
        Body.COLLIDE_EVENT_NAME = "collide",
        Body.DYNAMIC = 1,
        Body.STATIC = 2,
        Body.KINEMATIC = 4,
        Body.AWAKE = 0,
        Body.SLEEPY = 1,
        Body.SLEEPING = 2,
        Body.idCounter = 0,
        Body.wakeupEvent = {
            type: "wakeup"
        },
        Body.prototype.wakeUp = function() {
            var s = this.sleepState;
            this.sleepState = 0,
            this._wakeUpAfterNarrowphase = !1,
            s === Body.SLEEPING && this.dispatchEvent(Body.wakeupEvent)
        }
        ,
        Body.prototype.sleep = function() {
            this.sleepState = Body.SLEEPING,
            this.velocity.set(0, 0, 0),
            this.angularVelocity.set(0, 0, 0),
            this._wakeUpAfterNarrowphase = !1
        }
        ,
        Body.sleepyEvent = {
            type: "sleepy"
        },
        Body.sleepEvent = {
            type: "sleep"
        },
        Body.prototype.sleepTick = function(time) {
            if (this.allowSleep) {
                var sleepState = this.sleepState
                  , speedSquared = this.velocity.norm2() + this.angularVelocity.norm2()
                  , speedLimitSquared = Math.pow(this.sleepSpeedLimit, 2);
                sleepState === Body.AWAKE && speedSquared < speedLimitSquared ? (this.sleepState = Body.SLEEPY,
                this.timeLastSleepy = time,
                this.dispatchEvent(Body.sleepyEvent)) : sleepState === Body.SLEEPY && speedSquared > speedLimitSquared ? this.wakeUp() : sleepState === Body.SLEEPY && time - this.timeLastSleepy > this.sleepTimeLimit && (this.sleep(),
                this.dispatchEvent(Body.sleepEvent))
            }
        }
        ,
        Body.prototype.updateSolveMassProperties = function() {
            this.sleepState === Body.SLEEPING || this.type === Body.KINEMATIC ? (this.invMassSolve = 0,
            this.invInertiaSolve.setZero(),
            this.invInertiaWorldSolve.setZero()) : (this.invMassSolve = this.invMass,
            this.invInertiaSolve.copy(this.invInertia),
            this.invInertiaWorldSolve.copy(this.invInertiaWorld))
        }
        ,
        Body.prototype.pointToLocalFrame = function(worldPoint, result) {
            var result = result || new Vec3;
            return worldPoint.vsub(this.position, result),
            this.quaternion.conjugate().vmult(result, result),
            result
        }
        ,
        Body.prototype.vectorToLocalFrame = function(worldVector, result) {
            var result = result || new Vec3;
            return this.quaternion.conjugate().vmult(worldVector, result),
            result
        }
        ,
        Body.prototype.pointToWorldFrame = function(localPoint, result) {
            var result = result || new Vec3;
            return this.quaternion.vmult(localPoint, result),
            result.vadd(this.position, result),
            result
        }
        ,
        Body.prototype.vectorToWorldFrame = function(localVector, result) {
            var result = result || new Vec3;
            return this.quaternion.vmult(localVector, result),
            result
        }
        ;
        var tmpVec = new Vec3
          , tmpQuat = new Quaternion;
        Body.prototype.addShape = function(shape, _offset, _orientation) {
            var offset = new Vec3
              , orientation = new Quaternion;
            return _offset && offset.copy(_offset),
            _orientation && orientation.copy(_orientation),
            this.shapes.push(shape),
            this.shapeOffsets.push(offset),
            this.shapeOrientations.push(orientation),
            this.updateMassProperties(),
            this.updateBoundingRadius(),
            this.aabbNeedsUpdate = !0,
            shape.body = this,
            this
        }
        ,
        Body.prototype.updateBoundingRadius = function() {
            for (var shapes = this.shapes, shapeOffsets = this.shapeOffsets, N = shapes.length, radius = 0, i = 0; i !== N; i++) {
                var shape = shapes[i];
                shape.updateBoundingSphereRadius();
                var offset = shapeOffsets[i].norm()
                  , r = shape.boundingSphereRadius;
                offset + r > radius && (radius = offset + r)
            }
            this.boundingRadius = radius
        }
        ;
        var computeAABB_shapeAABB = new AABB;
        Body.prototype.computeAABB = function() {
            for (var shapes = this.shapes, shapeOffsets = this.shapeOffsets, shapeOrientations = this.shapeOrientations, N = shapes.length, offset = tmpVec, orientation = tmpQuat, bodyQuat = this.quaternion, aabb = this.aabb, shapeAABB = computeAABB_shapeAABB, i = 0; i !== N; i++) {
                var shape = shapes[i];
                bodyQuat.vmult(shapeOffsets[i], offset),
                offset.vadd(this.position, offset),
                shapeOrientations[i].mult(bodyQuat, orientation),
                shape.calculateWorldAABB(offset, orientation, shapeAABB.lowerBound, shapeAABB.upperBound),
                0 === i ? aabb.copy(shapeAABB) : aabb.extend(shapeAABB)
            }
            this.aabbNeedsUpdate = !1
        }
        ;
        var uiw_m1 = new Mat3
          , uiw_m2 = new Mat3;
        new Mat3;
        Body.prototype.updateInertiaWorld = function(force) {
            var I = this.invInertia;
            if (I.x !== I.y || I.y !== I.z || force) {
                var m1 = uiw_m1
                  , m2 = uiw_m2;
                m1.setRotationFromQuaternion(this.quaternion),
                m1.transpose(m2),
                m1.scale(I, m1),
                m1.mmult(m2, this.invInertiaWorld)
            } else
                ;
        }
        ;
        new Vec3;
        var Body_applyForce_rotForce = new Vec3;
        Body.prototype.applyForce = function(force, relativePoint) {
            if (this.type === Body.DYNAMIC) {
                var rotForce = Body_applyForce_rotForce;
                relativePoint.cross(force, rotForce),
                this.force.vadd(force, this.force),
                this.torque.vadd(rotForce, this.torque)
            }
        }
        ;
        var Body_applyLocalForce_worldForce = new Vec3
          , Body_applyLocalForce_relativePointWorld = new Vec3;
        Body.prototype.applyLocalForce = function(localForce, localPoint) {
            if (this.type === Body.DYNAMIC) {
                var worldForce = Body_applyLocalForce_worldForce
                  , relativePointWorld = Body_applyLocalForce_relativePointWorld;
                this.vectorToWorldFrame(localForce, worldForce),
                this.vectorToWorldFrame(localPoint, relativePointWorld),
                this.applyForce(worldForce, relativePointWorld)
            }
        }
        ;
        new Vec3;
        var Body_applyImpulse_velo = new Vec3
          , Body_applyImpulse_rotVelo = new Vec3;
        Body.prototype.applyImpulse = function(impulse, relativePoint) {
            if (this.type === Body.DYNAMIC) {
                var r = relativePoint
                  , velo = Body_applyImpulse_velo;
                velo.copy(impulse),
                velo.mult(this.invMass, velo),
                this.velocity.vadd(velo, this.velocity);
                var rotVelo = Body_applyImpulse_rotVelo;
                r.cross(impulse, rotVelo),
                this.invInertiaWorld.vmult(rotVelo, rotVelo),
                this.angularVelocity.vadd(rotVelo, this.angularVelocity)
            }
        }
        ;
        var Body_applyLocalImpulse_worldImpulse = new Vec3
          , Body_applyLocalImpulse_relativePoint = new Vec3;
        Body.prototype.applyLocalImpulse = function(localImpulse, localPoint) {
            if (this.type === Body.DYNAMIC) {
                var worldImpulse = Body_applyLocalImpulse_worldImpulse
                  , relativePointWorld = Body_applyLocalImpulse_relativePoint;
                this.vectorToWorldFrame(localImpulse, worldImpulse),
                this.vectorToWorldFrame(localPoint, relativePointWorld),
                this.applyImpulse(worldImpulse, relativePointWorld)
            }
        }
        ;
        var Body_updateMassProperties_halfExtents = new Vec3;
        Body.prototype.updateMassProperties = function() {
            var halfExtents = Body_updateMassProperties_halfExtents;
            this.invMass = this.mass > 0 ? 1 / this.mass : 0;
            var I = this.inertia
              , fixed = this.fixedRotation;
            this.computeAABB(),
            halfExtents.set((this.aabb.upperBound.x - this.aabb.lowerBound.x) / 2, (this.aabb.upperBound.y - this.aabb.lowerBound.y) / 2, (this.aabb.upperBound.z - this.aabb.lowerBound.z) / 2),
            Box.calculateInertia(halfExtents, this.mass, I),
            this.invInertia.set(I.x > 0 && !fixed ? 1 / I.x : 0, I.y > 0 && !fixed ? 1 / I.y : 0, I.z > 0 && !fixed ? 1 / I.z : 0),
            this.updateInertiaWorld(!0)
        }
        ,
        Body.prototype.getVelocityAtWorldPoint = function(worldPoint, result) {
            var r = new Vec3;
            return worldPoint.vsub(this.position, r),
            this.angularVelocity.cross(r, result),
            this.velocity.vadd(result, result),
            result
        }
        ;
        new Vec3,
        new Vec3,
        new Quaternion,
        new Quaternion;
        Body.prototype.integrate = function(dt, quatNormalize, quatNormalizeFast) {
            if (this.previousPosition.copy(this.position),
            this.previousQuaternion.copy(this.quaternion),
            (this.type === Body.DYNAMIC || this.type === Body.KINEMATIC) && this.sleepState !== Body.SLEEPING) {
                var velo = this.velocity
                  , angularVelo = this.angularVelocity
                  , pos = this.position
                  , force = this.force
                  , torque = this.torque
                  , quat = this.quaternion
                  , invMass = this.invMass
                  , invInertia = this.invInertiaWorld
                  , linearFactor = this.linearFactor
                  , iMdt = invMass * dt;
                velo.x += force.x * iMdt * linearFactor.x,
                velo.y += force.y * iMdt * linearFactor.y,
                velo.z += force.z * iMdt * linearFactor.z;
                var e = invInertia.elements
                  , angularFactor = this.angularFactor
                  , tx = torque.x * angularFactor.x
                  , ty = torque.y * angularFactor.y
                  , tz = torque.z * angularFactor.z;
                angularVelo.x += dt * (e[0] * tx + e[1] * ty + e[2] * tz),
                angularVelo.y += dt * (e[3] * tx + e[4] * ty + e[5] * tz),
                angularVelo.z += dt * (e[6] * tx + e[7] * ty + e[8] * tz),
                pos.x += velo.x * dt,
                pos.y += velo.y * dt,
                pos.z += velo.z * dt,
                quat.integrate(this.angularVelocity, dt, this.angularFactor, quat),
                quatNormalize && (quatNormalizeFast ? quat.normalizeFast() : quat.normalize()),
                this.aabbNeedsUpdate = !0,
                this.updateInertiaWorld()
            }
        }
    }
    , {
        "../collision/AABB": 5,
        "../material/Material": 28,
        "../math/Mat3": 30,
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "../shapes/Box": 40,
        "../shapes/Shape": 46,
        "../utils/EventTarget": 52
    }],
    35: [function(require, module, exports) {
        function RaycastVehicle(options) {
            this.chassisBody = options.chassisBody,
            this.wheelInfos = [],
            this.sliding = !1,
            this.world = null,
            this.indexRightAxis = void 0 !== options.indexRightAxis ? options.indexRightAxis : 1,
            this.indexForwardAxis = void 0 !== options.indexForwardAxis ? options.indexForwardAxis : 0,
            this.indexUpAxis = void 0 !== options.indexUpAxis ? options.indexUpAxis : 2
        }
        function calcRollingFriction(body0, body1, frictionPosWorld, frictionDirectionWorld, maxImpulse) {
            var j1 = 0
              , contactPosWorld = frictionPosWorld
              , vel1 = calcRollingFriction_vel1
              , vel2 = calcRollingFriction_vel2
              , vel = calcRollingFriction_vel;
            body0.getVelocityAtWorldPoint(contactPosWorld, vel1),
            body1.getVelocityAtWorldPoint(contactPosWorld, vel2),
            vel1.vsub(vel2, vel);
            return j1 = -frictionDirectionWorld.dot(vel) * (1 / (computeImpulseDenominator(body0, frictionPosWorld, frictionDirectionWorld) + computeImpulseDenominator(body1, frictionPosWorld, frictionDirectionWorld))),
            maxImpulse < j1 && (j1 = maxImpulse),
            j1 < -maxImpulse && (j1 = -maxImpulse),
            j1
        }
        function computeImpulseDenominator(body, pos, normal) {
            var r0 = computeImpulseDenominator_r0
              , c0 = computeImpulseDenominator_c0
              , vec = computeImpulseDenominator_vec
              , m = computeImpulseDenominator_m;
            return pos.vsub(body.position, r0),
            r0.cross(normal, c0),
            body.invInertiaWorld.vmult(c0, m),
            m.cross(r0, vec),
            body.invMass + normal.dot(vec)
        }
        function resolveSingleBilateral(body1, pos1, body2, pos2, normal, impulse) {
            if (normal.norm2() > 1.1)
                return 0;
            var vel1 = resolveSingleBilateral_vel1
              , vel2 = resolveSingleBilateral_vel2
              , vel = resolveSingleBilateral_vel;
            body1.getVelocityAtWorldPoint(pos1, vel1),
            body2.getVelocityAtWorldPoint(pos2, vel2),
            vel1.vsub(vel2, vel);
            return -.2 * normal.dot(vel) * (1 / (body1.invMass + body2.invMass))
        }
        require("./Body");
        var Vec3 = require("../math/Vec3")
          , Quaternion = require("../math/Quaternion")
          , Ray = (require("../collision/RaycastResult"),
        require("../collision/Ray"))
          , WheelInfo = require("../objects/WheelInfo");
        module.exports = RaycastVehicle;
        new Vec3,
        new Vec3,
        new Vec3;
        var tmpVec4 = new Vec3
          , tmpVec5 = new Vec3
          , tmpVec6 = new Vec3;
        new Ray;
        RaycastVehicle.prototype.addWheel = function(options) {
            var info = new WheelInfo(options = options || {})
              , index = this.wheelInfos.length;
            return this.wheelInfos.push(info),
            index
        }
        ,
        RaycastVehicle.prototype.setSteeringValue = function(value, wheelIndex) {
            this.wheelInfos[wheelIndex].steering = value
        }
        ;
        new Vec3;
        RaycastVehicle.prototype.applyEngineForce = function(value, wheelIndex) {
            this.wheelInfos[wheelIndex].engineForce = value
        }
        ,
        RaycastVehicle.prototype.setBrake = function(brake, wheelIndex) {
            this.wheelInfos[wheelIndex].brake = brake
        }
        ,
        RaycastVehicle.prototype.addToWorld = function(world) {
            this.constraints;
            world.addBody(this.chassisBody);
            var that = this;
            this.preStepCallback = function() {
                that.updateVehicle(world.dt)
            }
            ,
            world.addEventListener("preStep", this.preStepCallback),
            this.world = world
        }
        ,
        RaycastVehicle.prototype.getVehicleAxisWorld = function(axisIndex, result) {
            result.set(0 === axisIndex ? 1 : 0, 1 === axisIndex ? 1 : 0, 2 === axisIndex ? 1 : 0),
            this.chassisBody.vectorToWorldFrame(result, result)
        }
        ,
        RaycastVehicle.prototype.updateVehicle = function(timeStep) {
            for (var wheelInfos = this.wheelInfos, numWheels = wheelInfos.length, chassisBody = this.chassisBody, i = 0; i < numWheels; i++)
                this.updateWheelTransform(i);
            this.currentVehicleSpeedKmHour = 3.6 * chassisBody.velocity.norm();
            var forwardWorld = new Vec3;
            this.getVehicleAxisWorld(this.indexForwardAxis, forwardWorld),
            forwardWorld.dot(chassisBody.velocity) < 0 && (this.currentVehicleSpeedKmHour *= -1);
            for (i = 0; i < numWheels; i++)
                this.castRay(wheelInfos[i]);
            this.updateSuspension(timeStep);
            for (var impulse = new Vec3, relpos = new Vec3, i = 0; i < numWheels; i++) {
                var suspensionForce = (wheel = wheelInfos[i]).suspensionForce;
                suspensionForce > wheel.maxSuspensionForce && (suspensionForce = wheel.maxSuspensionForce),
                wheel.raycastResult.hitNormalWorld.scale(suspensionForce * timeStep, impulse),
                wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, relpos),
                chassisBody.applyImpulse(impulse, relpos)
            }
            this.updateFriction(timeStep);
            var hitNormalWorldScaledWithProj = new Vec3
              , fwd = new Vec3
              , vel = new Vec3;
            for (i = 0; i < numWheels; i++) {
                var wheel = wheelInfos[i];
                chassisBody.getVelocityAtWorldPoint(wheel.chassisConnectionPointWorld, vel);
                var m = 1;
                switch (this.indexUpAxis) {
                case 1:
                    m = -1
                }
                if (wheel.isInContact) {
                    this.getVehicleAxisWorld(this.indexForwardAxis, fwd);
                    var proj = fwd.dot(wheel.raycastResult.hitNormalWorld);
                    wheel.raycastResult.hitNormalWorld.scale(proj, hitNormalWorldScaledWithProj),
                    fwd.vsub(hitNormalWorldScaledWithProj, fwd);
                    var proj2 = fwd.dot(vel);
                    wheel.deltaRotation = m * proj2 * timeStep / wheel.radius
                }
                !wheel.sliding && wheel.isInContact || 0 === wheel.engineForce || !wheel.useCustomSlidingRotationalSpeed || (wheel.deltaRotation = (wheel.engineForce > 0 ? 1 : -1) * wheel.customSlidingRotationalSpeed * timeStep),
                Math.abs(wheel.brake) > Math.abs(wheel.engineForce) && (wheel.deltaRotation = 0),
                wheel.rotation += wheel.deltaRotation,
                wheel.deltaRotation *= .99
            }
        }
        ,
        RaycastVehicle.prototype.updateSuspension = function(deltaTime) {
            for (var chassisMass = this.chassisBody.mass, wheelInfos = this.wheelInfos, numWheels = wheelInfos.length, w_it = 0; w_it < numWheels; w_it++) {
                var wheel = wheelInfos[w_it];
                if (wheel.isInContact) {
                    var force, length_diff = wheel.suspensionRestLength - wheel.suspensionLength;
                    force = wheel.suspensionStiffness * length_diff * wheel.clippedInvContactDotSuspension;
                    var projected_rel_vel = wheel.suspensionRelativeVelocity;
                    force -= (projected_rel_vel < 0 ? wheel.dampingCompression : wheel.dampingRelaxation) * projected_rel_vel,
                    wheel.suspensionForce = force * chassisMass,
                    wheel.suspensionForce < 0 && (wheel.suspensionForce = 0)
                } else
                    wheel.suspensionForce = 0
            }
        }
        ,
        RaycastVehicle.prototype.removeFromWorld = function(world) {
            this.constraints;
            world.remove(this.chassisBody),
            world.removeEventListener("preStep", this.preStepCallback),
            this.world = null
        }
        ;
        var castRay_rayvector = new Vec3
          , castRay_target = new Vec3;
        RaycastVehicle.prototype.castRay = function(wheel) {
            var rayvector = castRay_rayvector
              , target = castRay_target;
            this.updateWheelTransformWorld(wheel);
            var chassisBody = this.chassisBody
              , depth = -1
              , raylen = wheel.suspensionRestLength + wheel.radius;
            wheel.directionWorld.scale(raylen, rayvector);
            var source = wheel.chassisConnectionPointWorld;
            source.vadd(rayvector, target);
            var raycastResult = wheel.raycastResult;
            raycastResult.reset();
            var oldState = chassisBody.collisionResponse;
            chassisBody.collisionResponse = !1,
            this.world.rayTest(source, target, raycastResult),
            chassisBody.collisionResponse = oldState;
            var object = raycastResult.body;
            if (wheel.raycastResult.groundObject = 0,
            object) {
                depth = raycastResult.distance,
                wheel.raycastResult.hitNormalWorld = raycastResult.hitNormalWorld,
                wheel.isInContact = !0;
                var hitDistance = raycastResult.distance;
                wheel.suspensionLength = hitDistance - wheel.radius;
                var minSuspensionLength = wheel.suspensionRestLength - wheel.maxSuspensionTravel
                  , maxSuspensionLength = wheel.suspensionRestLength + wheel.maxSuspensionTravel;
                wheel.suspensionLength < minSuspensionLength && (wheel.suspensionLength = minSuspensionLength),
                wheel.suspensionLength > maxSuspensionLength && (wheel.suspensionLength = maxSuspensionLength,
                wheel.raycastResult.reset());
                var denominator = wheel.raycastResult.hitNormalWorld.dot(wheel.directionWorld)
                  , chassis_velocity_at_contactPoint = new Vec3;
                chassisBody.getVelocityAtWorldPoint(wheel.raycastResult.hitPointWorld, chassis_velocity_at_contactPoint);
                var projVel = wheel.raycastResult.hitNormalWorld.dot(chassis_velocity_at_contactPoint);
                if (denominator >= -.1)
                    wheel.suspensionRelativeVelocity = 0,
                    wheel.clippedInvContactDotSuspension = 10;
                else {
                    var inv = -1 / denominator;
                    wheel.suspensionRelativeVelocity = projVel * inv,
                    wheel.clippedInvContactDotSuspension = inv
                }
            } else
                wheel.suspensionLength = wheel.suspensionRestLength + 0 * wheel.maxSuspensionTravel,
                wheel.suspensionRelativeVelocity = 0,
                wheel.directionWorld.scale(-1, wheel.raycastResult.hitNormalWorld),
                wheel.clippedInvContactDotSuspension = 1;
            return depth
        }
        ,
        RaycastVehicle.prototype.updateWheelTransformWorld = function(wheel) {
            wheel.isInContact = !1;
            var chassisBody = this.chassisBody;
            chassisBody.pointToWorldFrame(wheel.chassisConnectionPointLocal, wheel.chassisConnectionPointWorld),
            chassisBody.vectorToWorldFrame(wheel.directionLocal, wheel.directionWorld),
            chassisBody.vectorToWorldFrame(wheel.axleLocal, wheel.axleWorld)
        }
        ,
        RaycastVehicle.prototype.updateWheelTransform = function(wheelIndex) {
            var up = tmpVec4
              , right = tmpVec5
              , fwd = tmpVec6
              , wheel = this.wheelInfos[wheelIndex];
            this.updateWheelTransformWorld(wheel),
            wheel.directionLocal.scale(-1, up),
            right.copy(wheel.axleLocal),
            up.cross(right, fwd),
            fwd.normalize(),
            right.normalize();
            var steering = wheel.steering
              , steeringOrn = new Quaternion;
            steeringOrn.setFromAxisAngle(up, steering);
            var rotatingOrn = new Quaternion;
            rotatingOrn.setFromAxisAngle(right, wheel.rotation);
            var q = wheel.worldTransform.quaternion;
            this.chassisBody.quaternion.mult(steeringOrn, q),
            q.mult(rotatingOrn, q),
            q.normalize();
            var p = wheel.worldTransform.position;
            p.copy(wheel.directionWorld),
            p.scale(wheel.suspensionLength, p),
            p.vadd(wheel.chassisConnectionPointWorld, p)
        }
        ;
        var directions = [new Vec3(1,0,0), new Vec3(0,1,0), new Vec3(0,0,1)];
        RaycastVehicle.prototype.getWheelTransformWorld = function(wheelIndex) {
            return this.wheelInfos[wheelIndex].worldTransform
        }
        ;
        var updateFriction_surfNormalWS_scaled_proj = new Vec3
          , updateFriction_axle = []
          , updateFriction_forwardWS = [];
        RaycastVehicle.prototype.updateFriction = function(timeStep) {
            for (var surfNormalWS_scaled_proj = updateFriction_surfNormalWS_scaled_proj, wheelInfos = this.wheelInfos, numWheels = wheelInfos.length, chassisBody = this.chassisBody, forwardWS = updateFriction_forwardWS, axle = updateFriction_axle, numWheelsOnGround = 0, i = 0; i < numWheels; i++)
                (groundObject = (wheel = wheelInfos[i]).raycastResult.body) && numWheelsOnGround++,
                wheel.sideImpulse = 0,
                wheel.forwardImpulse = 0,
                forwardWS[i] || (forwardWS[i] = new Vec3),
                axle[i] || (axle[i] = new Vec3);
            for (i = 0; i < numWheels; i++)
                if (groundObject = (wheel = wheelInfos[i]).raycastResult.body) {
                    var axlei = axle[i];
                    this.getWheelTransformWorld(i).vectorToWorldFrame(directions[this.indexRightAxis], axlei);
                    var surfNormalWS = wheel.raycastResult.hitNormalWorld
                      , proj = axlei.dot(surfNormalWS);
                    surfNormalWS.scale(proj, surfNormalWS_scaled_proj),
                    axlei.vsub(surfNormalWS_scaled_proj, axlei),
                    axlei.normalize(),
                    surfNormalWS.cross(axlei, forwardWS[i]),
                    forwardWS[i].normalize(),
                    wheel.sideImpulse = resolveSingleBilateral(chassisBody, wheel.raycastResult.hitPointWorld, groundObject, wheel.raycastResult.hitPointWorld, axlei),
                    wheel.sideImpulse *= 1
                }
            this.sliding = !1;
            for (i = 0; i < numWheels; i++) {
                var groundObject = (wheel = wheelInfos[i]).raycastResult.body
                  , rollingFriction = 0;
                if (wheel.slipInfo = 1,
                groundObject) {
                    var maxImpulse = wheel.brake ? wheel.brake : 0;
                    rollingFriction = calcRollingFriction(chassisBody, groundObject, wheel.raycastResult.hitPointWorld, forwardWS[i], maxImpulse);
                    factor = maxImpulse / (rollingFriction += wheel.engineForce * timeStep);
                    wheel.slipInfo *= factor
                }
                if (wheel.forwardImpulse = 0,
                wheel.skidInfo = 1,
                groundObject) {
                    wheel.skidInfo = 1;
                    var maximp = wheel.suspensionForce * timeStep * wheel.frictionSlip
                      , maximpSquared = maximp * maximp;
                    wheel.forwardImpulse = rollingFriction;
                    var x = .5 * wheel.forwardImpulse
                      , y = 1 * wheel.sideImpulse
                      , impulseSquared = x * x + y * y;
                    if (wheel.sliding = !1,
                    impulseSquared > maximpSquared) {
                        this.sliding = !0,
                        wheel.sliding = !0;
                        var factor = maximp / Math.sqrt(impulseSquared);
                        wheel.skidInfo *= factor
                    }
                }
            }
            if (this.sliding)
                for (i = 0; i < numWheels; i++)
                    0 !== (wheel = wheelInfos[i]).sideImpulse && wheel.skidInfo < 1 && (wheel.forwardImpulse *= wheel.skidInfo,
                    wheel.sideImpulse *= wheel.skidInfo);
            for (i = 0; i < numWheels; i++) {
                var wheel = wheelInfos[i]
                  , rel_pos = new Vec3;
                if (wheel.raycastResult.hitPointWorld.vsub(chassisBody.position, rel_pos),
                0 !== wheel.forwardImpulse) {
                    var impulse = new Vec3;
                    forwardWS[i].scale(wheel.forwardImpulse, impulse),
                    chassisBody.applyImpulse(impulse, rel_pos)
                }
                if (0 !== wheel.sideImpulse) {
                    var groundObject = wheel.raycastResult.body
                      , rel_pos2 = new Vec3;
                    wheel.raycastResult.hitPointWorld.vsub(groundObject.position, rel_pos2);
                    var sideImp = new Vec3;
                    axle[i].scale(wheel.sideImpulse, sideImp),
                    chassisBody.vectorToLocalFrame(rel_pos, rel_pos),
                    rel_pos["xyz"[this.indexUpAxis]] *= wheel.rollInfluence,
                    chassisBody.vectorToWorldFrame(rel_pos, rel_pos),
                    chassisBody.applyImpulse(sideImp, rel_pos),
                    sideImp.scale(-1, sideImp),
                    groundObject.applyImpulse(sideImp, rel_pos2)
                }
            }
        }
        ;
        var calcRollingFriction_vel1 = new Vec3
          , calcRollingFriction_vel2 = new Vec3
          , calcRollingFriction_vel = new Vec3
          , computeImpulseDenominator_r0 = new Vec3
          , computeImpulseDenominator_c0 = new Vec3
          , computeImpulseDenominator_vec = new Vec3
          , computeImpulseDenominator_m = new Vec3
          , resolveSingleBilateral_vel1 = new Vec3
          , resolveSingleBilateral_vel2 = new Vec3
          , resolveSingleBilateral_vel = new Vec3
    }
    , {
        "../collision/Ray": 12,
        "../collision/RaycastResult": 13,
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "../objects/WheelInfo": 39,
        "./Body": 34
    }],
    36: [function(require, module, exports) {
        function RigidVehicle(options) {
            if (this.wheelBodies = [],
            this.coordinateSystem = void 0 === options.coordinateSystem ? new Vec3(1,2,3) : options.coordinateSystem.clone(),
            this.chassisBody = options.chassisBody,
            !this.chassisBody) {
                var chassisShape = new Box(new Vec3(5,2,.5));
                this.chassisBody = new Body(1,chassisShape)
            }
            this.constraints = [],
            this.wheelAxes = [],
            this.wheelForces = []
        }
        var Body = require("./Body")
          , Sphere = require("../shapes/Sphere")
          , Box = require("../shapes/Box")
          , Vec3 = require("../math/Vec3")
          , HingeConstraint = require("../constraints/HingeConstraint");
        module.exports = RigidVehicle,
        RigidVehicle.prototype.addWheel = function(options) {
            var wheelBody = (options = options || {}).body;
            wheelBody || (wheelBody = new Body(1,new Sphere(1.2))),
            this.wheelBodies.push(wheelBody),
            this.wheelForces.push(0);
            new Vec3;
            var position = void 0 !== options.position ? options.position.clone() : new Vec3
              , worldPosition = new Vec3;
            this.chassisBody.pointToWorldFrame(position, worldPosition),
            wheelBody.position.set(worldPosition.x, worldPosition.y, worldPosition.z);
            var axis = void 0 !== options.axis ? options.axis.clone() : new Vec3(0,1,0);
            this.wheelAxes.push(axis);
            var hingeConstraint = new HingeConstraint(this.chassisBody,wheelBody,{
                pivotA: position,
                axisA: axis,
                pivotB: Vec3.ZERO,
                axisB: axis,
                collideConnected: !1
            });
            return this.constraints.push(hingeConstraint),
            this.wheelBodies.length - 1
        }
        ,
        RigidVehicle.prototype.setSteeringValue = function(value, wheelIndex) {
            var axis = this.wheelAxes[wheelIndex]
              , c = Math.cos(value)
              , s = Math.sin(value)
              , x = axis.x
              , y = axis.y;
            this.constraints[wheelIndex].axisA.set(c * x - s * y, s * x + c * y, 0)
        }
        ,
        RigidVehicle.prototype.setMotorSpeed = function(value, wheelIndex) {
            var hingeConstraint = this.constraints[wheelIndex];
            hingeConstraint.enableMotor(),
            hingeConstraint.motorTargetVelocity = value
        }
        ,
        RigidVehicle.prototype.disableMotor = function(wheelIndex) {
            this.constraints[wheelIndex].disableMotor()
        }
        ;
        var torque = new Vec3;
        RigidVehicle.prototype.setWheelForce = function(value, wheelIndex) {
            this.wheelForces[wheelIndex] = value
        }
        ,
        RigidVehicle.prototype.applyWheelForce = function(value, wheelIndex) {
            var axis = this.wheelAxes[wheelIndex]
              , wheelBody = this.wheelBodies[wheelIndex]
              , bodyTorque = wheelBody.torque;
            axis.scale(value, torque),
            wheelBody.vectorToWorldFrame(torque, torque),
            bodyTorque.vadd(torque, bodyTorque)
        }
        ,
        RigidVehicle.prototype.addToWorld = function(world) {
            for (var constraints = this.constraints, bodies = this.wheelBodies.concat([this.chassisBody]), i = 0; i < bodies.length; i++)
                world.addBody(bodies[i]);
            for (i = 0; i < constraints.length; i++)
                world.addConstraint(constraints[i]);
            world.addEventListener("preStep", this._update.bind(this))
        }
        ,
        RigidVehicle.prototype._update = function() {
            for (var wheelForces = this.wheelForces, i = 0; i < wheelForces.length; i++)
                this.applyWheelForce(wheelForces[i], i)
        }
        ,
        RigidVehicle.prototype.removeFromWorld = function(world) {
            for (var constraints = this.constraints, bodies = this.wheelBodies.concat([this.chassisBody]), i = 0; i < bodies.length; i++)
                world.remove(bodies[i]);
            for (i = 0; i < constraints.length; i++)
                world.removeConstraint(constraints[i])
        }
        ;
        var worldAxis = new Vec3;
        RigidVehicle.prototype.getWheelSpeed = function(wheelIndex) {
            var axis = this.wheelAxes[wheelIndex]
              , w = this.wheelBodies[wheelIndex].angularVelocity;
            return this.chassisBody.vectorToWorldFrame(axis, worldAxis),
            w.dot(worldAxis)
        }
    }
    , {
        "../constraints/HingeConstraint": 18,
        "../math/Vec3": 33,
        "../shapes/Box": 40,
        "../shapes/Sphere": 47,
        "./Body": 34
    }],
    37: [function(require, module, exports) {
        function SPHSystem() {
            this.particles = [],
            this.density = 1,
            this.smoothingRadius = 1,
            this.speedOfSound = 1,
            this.viscosity = .01,
            this.eps = 1e-6,
            this.pressures = [],
            this.densities = [],
            this.neighbors = []
        }
        module.exports = SPHSystem;
        require("../shapes/Shape");
        var Vec3 = require("../math/Vec3");
        require("../math/Quaternion"),
        require("../shapes/Particle"),
        require("../objects/Body"),
        require("../material/Material");
        SPHSystem.prototype.add = function(particle) {
            this.particles.push(particle),
            this.neighbors.length < this.particles.length && this.neighbors.push([])
        }
        ,
        SPHSystem.prototype.remove = function(particle) {
            var idx = this.particles.indexOf(particle);
            -1 !== idx && (this.particles.splice(idx, 1),
            this.neighbors.length > this.particles.length && this.neighbors.pop())
        }
        ;
        var SPHSystem_getNeighbors_dist = new Vec3;
        SPHSystem.prototype.getNeighbors = function(particle, neighbors) {
            for (var N = this.particles.length, id = particle.id, R2 = this.smoothingRadius * this.smoothingRadius, dist = SPHSystem_getNeighbors_dist, i = 0; i !== N; i++) {
                var p = this.particles[i];
                p.position.vsub(particle.position, dist),
                id !== p.id && dist.norm2() < R2 && neighbors.push(p)
            }
        }
        ;
        var SPHSystem_update_dist = new Vec3
          , SPHSystem_update_a_pressure = new Vec3
          , SPHSystem_update_a_visc = new Vec3
          , SPHSystem_update_gradW = new Vec3
          , SPHSystem_update_r_vec = new Vec3
          , SPHSystem_update_u = new Vec3;
        SPHSystem.prototype.update = function() {
            for (var N = this.particles.length, dist = SPHSystem_update_dist, cs = this.speedOfSound, eps = this.eps, i = 0; i !== N; i++) {
                var p = this.particles[i];
                (neighbors = this.neighbors[i]).length = 0,
                this.getNeighbors(p, neighbors),
                neighbors.push(this.particles[i]);
                for (var numNeighbors = neighbors.length, sum = 0, j = 0; j !== numNeighbors; j++) {
                    p.position.vsub(neighbors[j].position, dist);
                    var len = dist.norm()
                      , weight = this.w(len);
                    sum += neighbors[j].mass * weight
                }
                this.densities[i] = sum,
                this.pressures[i] = cs * cs * (this.densities[i] - this.density)
            }
            for (var a_pressure = SPHSystem_update_a_pressure, a_visc = SPHSystem_update_a_visc, gradW = SPHSystem_update_gradW, r_vec = SPHSystem_update_r_vec, u = SPHSystem_update_u, i = 0; i !== N; i++) {
                var particle = this.particles[i];
                a_pressure.set(0, 0, 0),
                a_visc.set(0, 0, 0);
                for (var Pij, nabla, neighbors = this.neighbors[i], numNeighbors = neighbors.length, j = 0; j !== numNeighbors; j++) {
                    var neighbor = neighbors[j];
                    particle.position.vsub(neighbor.position, r_vec);
                    var r = r_vec.norm();
                    Pij = -neighbor.mass * (this.pressures[i] / (this.densities[i] * this.densities[i] + eps) + this.pressures[j] / (this.densities[j] * this.densities[j] + eps)),
                    this.gradw(r_vec, gradW),
                    gradW.mult(Pij, gradW),
                    a_pressure.vadd(gradW, a_pressure),
                    neighbor.velocity.vsub(particle.velocity, u),
                    u.mult(1 / (1e-4 + this.densities[i] * this.densities[j]) * this.viscosity * neighbor.mass, u),
                    nabla = this.nablaw(r),
                    u.mult(nabla, u),
                    a_visc.vadd(u, a_visc)
                }
                a_visc.mult(particle.mass, a_visc),
                a_pressure.mult(particle.mass, a_pressure),
                particle.force.vadd(a_visc, particle.force),
                particle.force.vadd(a_pressure, particle.force)
            }
        }
        ,
        SPHSystem.prototype.w = function(r) {
            var h = this.smoothingRadius;
            return 315 / (64 * Math.PI * Math.pow(h, 9)) * Math.pow(h * h - r * r, 3)
        }
        ,
        SPHSystem.prototype.gradw = function(rVec, resultVec) {
            var r = rVec.norm()
              , h = this.smoothingRadius;
            rVec.mult(945 / (32 * Math.PI * Math.pow(h, 9)) * Math.pow(h * h - r * r, 2), resultVec)
        }
        ,
        SPHSystem.prototype.nablaw = function(r) {
            var h = this.smoothingRadius;
            return 945 / (32 * Math.PI * Math.pow(h, 9)) * (h * h - r * r) * (7 * r * r - 3 * h * h)
        }
    }
    , {
        "../material/Material": 28,
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "../objects/Body": 34,
        "../shapes/Particle": 44,
        "../shapes/Shape": 46
    }],
    38: [function(require, module, exports) {
        function Spring(bodyA, bodyB, options) {
            options = options || {},
            this.restLength = "number" == typeof options.restLength ? options.restLength : 1,
            this.stiffness = options.stiffness || 100,
            this.damping = options.damping || 1,
            this.bodyA = bodyA,
            this.bodyB = bodyB,
            this.localAnchorA = new Vec3,
            this.localAnchorB = new Vec3,
            options.localAnchorA && this.localAnchorA.copy(options.localAnchorA),
            options.localAnchorB && this.localAnchorB.copy(options.localAnchorB),
            options.worldAnchorA && this.setWorldAnchorA(options.worldAnchorA),
            options.worldAnchorB && this.setWorldAnchorB(options.worldAnchorB)
        }
        var Vec3 = require("../math/Vec3");
        module.exports = Spring,
        Spring.prototype.setWorldAnchorA = function(worldAnchorA) {
            this.bodyA.pointToLocalFrame(worldAnchorA, this.localAnchorA)
        }
        ,
        Spring.prototype.setWorldAnchorB = function(worldAnchorB) {
            this.bodyB.pointToLocalFrame(worldAnchorB, this.localAnchorB)
        }
        ,
        Spring.prototype.getWorldAnchorA = function(result) {
            this.bodyA.pointToWorldFrame(this.localAnchorA, result)
        }
        ,
        Spring.prototype.getWorldAnchorB = function(result) {
            this.bodyB.pointToWorldFrame(this.localAnchorB, result)
        }
        ;
        var applyForce_r = new Vec3
          , applyForce_r_unit = new Vec3
          , applyForce_u = new Vec3
          , applyForce_f = new Vec3
          , applyForce_worldAnchorA = new Vec3
          , applyForce_worldAnchorB = new Vec3
          , applyForce_ri = new Vec3
          , applyForce_rj = new Vec3
          , applyForce_ri_x_f = new Vec3
          , applyForce_rj_x_f = new Vec3
          , applyForce_tmp = new Vec3;
        Spring.prototype.applyForce = function() {
            var k = this.stiffness
              , d = this.damping
              , l = this.restLength
              , bodyA = this.bodyA
              , bodyB = this.bodyB
              , r = applyForce_r
              , r_unit = applyForce_r_unit
              , u = applyForce_u
              , f = applyForce_f
              , tmp = applyForce_tmp
              , worldAnchorA = applyForce_worldAnchorA
              , worldAnchorB = applyForce_worldAnchorB
              , ri = applyForce_ri
              , rj = applyForce_rj
              , ri_x_f = applyForce_ri_x_f
              , rj_x_f = applyForce_rj_x_f;
            this.getWorldAnchorA(worldAnchorA),
            this.getWorldAnchorB(worldAnchorB),
            worldAnchorA.vsub(bodyA.position, ri),
            worldAnchorB.vsub(bodyB.position, rj),
            worldAnchorB.vsub(worldAnchorA, r);
            var rlen = r.norm();
            r_unit.copy(r),
            r_unit.normalize(),
            bodyB.velocity.vsub(bodyA.velocity, u),
            bodyB.angularVelocity.cross(rj, tmp),
            u.vadd(tmp, u),
            bodyA.angularVelocity.cross(ri, tmp),
            u.vsub(tmp, u),
            r_unit.mult(-k * (rlen - l) - d * u.dot(r_unit), f),
            bodyA.force.vsub(f, bodyA.force),
            bodyB.force.vadd(f, bodyB.force),
            ri.cross(f, ri_x_f),
            rj.cross(f, rj_x_f),
            bodyA.torque.vsub(ri_x_f, bodyA.torque),
            bodyB.torque.vadd(rj_x_f, bodyB.torque)
        }
    }
    , {
        "../math/Vec3": 33
    }],
    39: [function(require, module, exports) {
        function WheelInfo(options) {
            options = Utils.defaults(options, {
                chassisConnectionPointLocal: new Vec3,
                chassisConnectionPointWorld: new Vec3,
                directionLocal: new Vec3,
                directionWorld: new Vec3,
                axleLocal: new Vec3,
                axleWorld: new Vec3,
                suspensionRestLength: 1,
                suspensionMaxLength: 2,
                radius: 1,
                suspensionStiffness: 100,
                dampingCompression: 10,
                dampingRelaxation: 10,
                frictionSlip: 1e4,
                steering: 0,
                rotation: 0,
                deltaRotation: 0,
                rollInfluence: .01,
                maxSuspensionForce: Number.MAX_VALUE,
                isFrontWheel: !0,
                clippedInvContactDotSuspension: 1,
                suspensionRelativeVelocity: 0,
                suspensionForce: 0,
                skidInfo: 0,
                suspensionLength: 0,
                maxSuspensionTravel: 1,
                useCustomSlidingRotationalSpeed: !1,
                customSlidingRotationalSpeed: -.1
            }),
            this.maxSuspensionTravel = options.maxSuspensionTravel,
            this.customSlidingRotationalSpeed = options.customSlidingRotationalSpeed,
            this.useCustomSlidingRotationalSpeed = options.useCustomSlidingRotationalSpeed,
            this.sliding = !1,
            this.chassisConnectionPointLocal = options.chassisConnectionPointLocal.clone(),
            this.chassisConnectionPointWorld = options.chassisConnectionPointWorld.clone(),
            this.directionLocal = options.directionLocal.clone(),
            this.directionWorld = options.directionWorld.clone(),
            this.axleLocal = options.axleLocal.clone(),
            this.axleWorld = options.axleWorld.clone(),
            this.suspensionRestLength = options.suspensionRestLength,
            this.suspensionMaxLength = options.suspensionMaxLength,
            this.radius = options.radius,
            this.suspensionStiffness = options.suspensionStiffness,
            this.dampingCompression = options.dampingCompression,
            this.dampingRelaxation = options.dampingRelaxation,
            this.frictionSlip = options.frictionSlip,
            this.steering = 0,
            this.rotation = 0,
            this.deltaRotation = 0,
            this.rollInfluence = options.rollInfluence,
            this.maxSuspensionForce = options.maxSuspensionForce,
            this.engineForce = 0,
            this.brake = 0,
            this.isFrontWheel = options.isFrontWheel,
            this.clippedInvContactDotSuspension = 1,
            this.suspensionRelativeVelocity = 0,
            this.suspensionForce = 0,
            this.skidInfo = 0,
            this.suspensionLength = 0,
            this.sideImpulse = 0,
            this.forwardImpulse = 0,
            this.raycastResult = new RaycastResult,
            this.worldTransform = new Transform,
            this.isInContact = !1
        }
        var Vec3 = require("../math/Vec3")
          , Transform = require("../math/Transform")
          , RaycastResult = require("../collision/RaycastResult")
          , Utils = require("../utils/Utils");
        module.exports = WheelInfo;
        var chassis_velocity_at_contactPoint = new Vec3
          , relpos = new Vec3
          , chassis_velocity_at_contactPoint = new Vec3;
        WheelInfo.prototype.updateWheel = function(chassis) {
            var raycastResult = this.raycastResult;
            if (this.isInContact) {
                var project = raycastResult.hitNormalWorld.dot(raycastResult.directionWorld);
                raycastResult.hitPointWorld.vsub(chassis.position, relpos),
                chassis.getVelocityAtWorldPoint(relpos, chassis_velocity_at_contactPoint);
                var projVel = raycastResult.hitNormalWorld.dot(chassis_velocity_at_contactPoint);
                if (project >= -.1)
                    this.suspensionRelativeVelocity = 0,
                    this.clippedInvContactDotSuspension = 10;
                else {
                    var inv = -1 / project;
                    this.suspensionRelativeVelocity = projVel * inv,
                    this.clippedInvContactDotSuspension = inv
                }
            } else
                raycastResult.suspensionLength = this.suspensionRestLength,
                this.suspensionRelativeVelocity = 0,
                raycastResult.directionWorld.scale(-1, raycastResult.hitNormalWorld),
                this.clippedInvContactDotSuspension = 1
        }
    }
    , {
        "../collision/RaycastResult": 13,
        "../math/Transform": 32,
        "../math/Vec3": 33,
        "../utils/Utils": 56
    }],
    40: [function(require, module, exports) {
        function Box(halfExtents) {
            Shape.call(this),
            this.type = Shape.types.BOX,
            this.halfExtents = halfExtents,
            this.convexPolyhedronRepresentation = null,
            this.updateConvexPolyhedronRepresentation(),
            this.updateBoundingSphereRadius()
        }
        module.exports = Box;
        var Shape = require("./Shape")
          , Vec3 = require("../math/Vec3")
          , ConvexPolyhedron = require("./ConvexPolyhedron");
        Box.prototype = new Shape,
        Box.prototype.constructor = Box,
        Box.prototype.updateConvexPolyhedronRepresentation = function() {
            var sx = this.halfExtents.x
              , sy = this.halfExtents.y
              , sz = this.halfExtents.z
              , V = Vec3
              , vertices = [new V(-sx,-sy,-sz), new V(sx,-sy,-sz), new V(sx,sy,-sz), new V(-sx,sy,-sz), new V(-sx,-sy,sz), new V(sx,-sy,sz), new V(sx,sy,sz), new V(-sx,sy,sz)]
              , indices = [[3, 2, 1, 0], [4, 5, 6, 7], [5, 4, 0, 1], [2, 3, 7, 6], [0, 4, 7, 3], [1, 2, 6, 5]]
              , h = (new V(0,0,1),
            new V(0,1,0),
            new V(1,0,0),
            new ConvexPolyhedron(vertices,indices));
            this.convexPolyhedronRepresentation = h,
            h.material = this.material
        }
        ,
        Box.prototype.calculateLocalInertia = function(mass, target) {
            return target = target || new Vec3,
            Box.calculateInertia(this.halfExtents, mass, target),
            target
        }
        ,
        Box.calculateInertia = function(halfExtents, mass, target) {
            var e = halfExtents;
            target.x = 1 / 12 * mass * (2 * e.y * 2 * e.y + 2 * e.z * 2 * e.z),
            target.y = 1 / 12 * mass * (2 * e.x * 2 * e.x + 2 * e.z * 2 * e.z),
            target.z = 1 / 12 * mass * (2 * e.y * 2 * e.y + 2 * e.x * 2 * e.x)
        }
        ,
        Box.prototype.getSideNormals = function(sixTargetVectors, quat) {
            var sides = sixTargetVectors
              , ex = this.halfExtents;
            if (sides[0].set(ex.x, 0, 0),
            sides[1].set(0, ex.y, 0),
            sides[2].set(0, 0, ex.z),
            sides[3].set(-ex.x, 0, 0),
            sides[4].set(0, -ex.y, 0),
            sides[5].set(0, 0, -ex.z),
            void 0 !== quat)
                for (var i = 0; i !== sides.length; i++)
                    quat.vmult(sides[i], sides[i]);
            return sides
        }
        ,
        Box.prototype.volume = function() {
            return 8 * this.halfExtents.x * this.halfExtents.y * this.halfExtents.z
        }
        ,
        Box.prototype.updateBoundingSphereRadius = function() {
            this.boundingSphereRadius = this.halfExtents.norm()
        }
        ;
        var worldCornerTempPos = new Vec3;
        new Vec3;
        Box.prototype.forEachWorldCorner = function(pos, quat, callback) {
            for (var e = this.halfExtents, corners = [[e.x, e.y, e.z], [-e.x, e.y, e.z], [-e.x, -e.y, e.z], [-e.x, -e.y, -e.z], [e.x, -e.y, -e.z], [e.x, e.y, -e.z], [-e.x, e.y, -e.z], [e.x, -e.y, e.z]], i = 0; i < corners.length; i++)
                worldCornerTempPos.set(corners[i][0], corners[i][1], corners[i][2]),
                quat.vmult(worldCornerTempPos, worldCornerTempPos),
                pos.vadd(worldCornerTempPos, worldCornerTempPos),
                callback(worldCornerTempPos.x, worldCornerTempPos.y, worldCornerTempPos.z)
        }
        ;
        var worldCornersTemp = [new Vec3, new Vec3, new Vec3, new Vec3, new Vec3, new Vec3, new Vec3, new Vec3];
        Box.prototype.calculateWorldAABB = function(pos, quat, min, max) {
            var e = this.halfExtents;
            worldCornersTemp[0].set(e.x, e.y, e.z),
            worldCornersTemp[1].set(-e.x, e.y, e.z),
            worldCornersTemp[2].set(-e.x, -e.y, e.z),
            worldCornersTemp[3].set(-e.x, -e.y, -e.z),
            worldCornersTemp[4].set(e.x, -e.y, -e.z),
            worldCornersTemp[5].set(e.x, e.y, -e.z),
            worldCornersTemp[6].set(-e.x, e.y, -e.z),
            worldCornersTemp[7].set(e.x, -e.y, e.z);
            wc = worldCornersTemp[0];
            quat.vmult(wc, wc),
            pos.vadd(wc, wc),
            max.copy(wc),
            min.copy(wc);
            for (var i = 1; i < 8; i++) {
                var wc = worldCornersTemp[i];
                quat.vmult(wc, wc),
                pos.vadd(wc, wc);
                var x = wc.x
                  , y = wc.y
                  , z = wc.z;
                x > max.x && (max.x = x),
                y > max.y && (max.y = y),
                z > max.z && (max.z = z),
                x < min.x && (min.x = x),
                y < min.y && (min.y = y),
                z < min.z && (min.z = z)
            }
        }
    }
    , {
        "../math/Vec3": 33,
        "./ConvexPolyhedron": 41,
        "./Shape": 46
    }],
    41: [function(require, module, exports) {
        function ConvexPolyhedron(points, faces, uniqueAxes) {
            Shape.call(this),
            this.type = Shape.types.CONVEXPOLYHEDRON,
            this.vertices = points || [],
            this.worldVertices = [],
            this.worldVerticesNeedsUpdate = !0,
            this.faces = faces || [],
            this.faceNormals = [],
            this.computeNormals(),
            this.worldFaceNormalsNeedsUpdate = !0,
            this.worldFaceNormals = [],
            this.uniqueEdges = [],
            this.uniqueAxes = uniqueAxes ? uniqueAxes.slice() : null,
            this.computeEdges(),
            this.updateBoundingSphereRadius()
        }
        module.exports = ConvexPolyhedron;
        var Shape = require("./Shape")
          , Vec3 = require("../math/Vec3")
          , Transform = (require("../math/Quaternion"),
        require("../math/Transform"));
        ConvexPolyhedron.prototype = new Shape,
        ConvexPolyhedron.prototype.constructor = ConvexPolyhedron;
        var computeEdges_tmpEdge = new Vec3;
        ConvexPolyhedron.prototype.computeEdges = function() {
            var faces = this.faces
              , vertices = this.vertices
              , edges = (vertices.length,
            this.uniqueEdges);
            edges.length = 0;
            for (var edge = computeEdges_tmpEdge, i = 0; i !== faces.length; i++)
                for (var face = faces[i], numVertices = face.length, j = 0; j !== numVertices; j++) {
                    var k = (j + 1) % numVertices;
                    vertices[face[j]].vsub(vertices[face[k]], edge),
                    edge.normalize();
                    for (var found = !1, p = 0; p !== edges.length; p++)
                        if (edges[p].almostEquals(edge) || edges[p].almostEquals(edge)) {
                            found = !0;
                            break
                        }
                    found || edges.push(edge.clone())
                }
        }
        ,
        ConvexPolyhedron.prototype.computeNormals = function() {
            this.faceNormals.length = this.faces.length;
            for (var i = 0; i < this.faces.length; i++) {
                for (j = 0; j < this.faces[i].length; j++)
                    if (!this.vertices[this.faces[i][j]])
                        throw new Error("Vertex " + this.faces[i][j] + " not found!");
                var n = this.faceNormals[i] || new Vec3;
                this.getFaceNormal(i, n),
                n.negate(n),
                this.faceNormals[i] = n;
                var vertex = this.vertices[this.faces[i][0]];
                if (n.dot(vertex) < 0) {
                    console.error(".faceNormals[" + i + "] = Vec3(" + n.toString() + ") looks like it points into the shape? The vertices follow. Make sure they are ordered CCW around the normal, using the right hand rule.");
                    for (var j = 0; j < this.faces[i].length; j++)
                        console.warn(".vertices[" + this.faces[i][j] + "] = Vec3(" + this.vertices[this.faces[i][j]].toString() + ")")
                }
            }
        }
        ;
        var cb = new Vec3
          , ab = new Vec3;
        ConvexPolyhedron.computeNormal = function(va, vb, vc, target) {
            vb.vsub(va, ab),
            vc.vsub(vb, cb),
            cb.cross(ab, target),
            target.isZero() || target.normalize()
        }
        ,
        ConvexPolyhedron.prototype.getFaceNormal = function(i, target) {
            var f = this.faces[i]
              , va = this.vertices[f[0]]
              , vb = this.vertices[f[1]]
              , vc = this.vertices[f[2]];
            return ConvexPolyhedron.computeNormal(va, vb, vc, target)
        }
        ;
        var cah_WorldNormal = new Vec3;
        ConvexPolyhedron.prototype.clipAgainstHull = function(posA, quatA, hullB, posB, quatB, separatingNormal, minDist, maxDist, result) {
            for (var WorldNormal = cah_WorldNormal, closestFaceB = -1, dmax = -Number.MAX_VALUE, face = 0; face < hullB.faces.length; face++) {
                WorldNormal.copy(hullB.faceNormals[face]),
                quatB.vmult(WorldNormal, WorldNormal);
                var d = WorldNormal.dot(separatingNormal);
                d > dmax && (dmax = d,
                closestFaceB = face)
            }
            for (var worldVertsB1 = [], polyB = hullB.faces[closestFaceB], numVertices = polyB.length, e0 = 0; e0 < numVertices; e0++) {
                var b = hullB.vertices[polyB[e0]]
                  , worldb = new Vec3;
                worldb.copy(b),
                quatB.vmult(worldb, worldb),
                posB.vadd(worldb, worldb),
                worldVertsB1.push(worldb)
            }
            closestFaceB >= 0 && this.clipFaceAgainstHull(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist, result)
        }
        ;
        var fsa_faceANormalWS3 = new Vec3
          , fsa_Worldnormal1 = new Vec3
          , fsa_deltaC = new Vec3
          , fsa_worldEdge0 = new Vec3
          , fsa_worldEdge1 = new Vec3
          , fsa_Cross = new Vec3;
        ConvexPolyhedron.prototype.findSeparatingAxis = function(hullB, posA, quatA, posB, quatB, target, faceListA, faceListB) {
            var faceANormalWS3 = fsa_faceANormalWS3
              , Worldnormal1 = fsa_Worldnormal1
              , deltaC = fsa_deltaC
              , worldEdge0 = fsa_worldEdge0
              , worldEdge1 = fsa_worldEdge1
              , Cross = fsa_Cross
              , dmin = Number.MAX_VALUE
              , hullA = this
              , curPlaneTests = 0;
            if (hullA.uniqueAxes)
                for (i = 0; i !== hullA.uniqueAxes.length; i++) {
                    if (quatA.vmult(hullA.uniqueAxes[i], faceANormalWS3),
                    !1 === (d = hullA.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB)))
                        return !1;
                    d < dmin && (dmin = d,
                    target.copy(faceANormalWS3))
                }
            else
                for (var numFacesA = faceListA ? faceListA.length : hullA.faces.length, i = 0; i < numFacesA; i++) {
                    fi = faceListA ? faceListA[i] : i;
                    if (faceANormalWS3.copy(hullA.faceNormals[fi]),
                    quatA.vmult(faceANormalWS3, faceANormalWS3),
                    !1 === (d = hullA.testSepAxis(faceANormalWS3, hullB, posA, quatA, posB, quatB)))
                        return !1;
                    d < dmin && (dmin = d,
                    target.copy(faceANormalWS3))
                }
            if (hullB.uniqueAxes)
                for (i = 0; i !== hullB.uniqueAxes.length; i++) {
                    quatB.vmult(hullB.uniqueAxes[i], Worldnormal1),
                    curPlaneTests++;
                    var d = hullA.testSepAxis(Worldnormal1, hullB, posA, quatA, posB, quatB);
                    if (!1 === d)
                        return !1;
                    d < dmin && (dmin = d,
                    target.copy(Worldnormal1))
                }
            else
                for (var numFacesB = faceListB ? faceListB.length : hullB.faces.length, i = 0; i < numFacesB; i++) {
                    var fi = faceListB ? faceListB[i] : i;
                    if (Worldnormal1.copy(hullB.faceNormals[fi]),
                    quatB.vmult(Worldnormal1, Worldnormal1),
                    curPlaneTests++,
                    !1 === (d = hullA.testSepAxis(Worldnormal1, hullB, posA, quatA, posB, quatB)))
                        return !1;
                    d < dmin && (dmin = d,
                    target.copy(Worldnormal1))
                }
            for (var e0 = 0; e0 !== hullA.uniqueEdges.length; e0++) {
                quatA.vmult(hullA.uniqueEdges[e0], worldEdge0);
                for (var e1 = 0; e1 !== hullB.uniqueEdges.length; e1++)
                    if (quatB.vmult(hullB.uniqueEdges[e1], worldEdge1),
                    worldEdge0.cross(worldEdge1, Cross),
                    !Cross.almostZero()) {
                        Cross.normalize();
                        var dist = hullA.testSepAxis(Cross, hullB, posA, quatA, posB, quatB);
                        if (!1 === dist)
                            return !1;
                        dist < dmin && (dmin = dist,
                        target.copy(Cross))
                    }
            }
            return posB.vsub(posA, deltaC),
            deltaC.dot(target) > 0 && target.negate(target),
            !0
        }
        ;
        var maxminA = []
          , maxminB = [];
        ConvexPolyhedron.prototype.testSepAxis = function(axis, hullB, posA, quatA, posB, quatB) {
            var hullA = this;
            ConvexPolyhedron.project(hullA, axis, posA, quatA, maxminA),
            ConvexPolyhedron.project(hullB, axis, posB, quatB, maxminB);
            var maxA = maxminA[0]
              , minA = maxminA[1]
              , maxB = maxminB[0]
              , minB = maxminB[1];
            if (maxA < minB || maxB < minA)
                return !1;
            var d0 = maxA - minB
              , d1 = maxB - minA;
            return d0 < d1 ? d0 : d1
        }
        ;
        var cli_aabbmin = new Vec3
          , cli_aabbmax = new Vec3;
        ConvexPolyhedron.prototype.calculateLocalInertia = function(mass, target) {
            this.computeLocalAABB(cli_aabbmin, cli_aabbmax);
            var x = cli_aabbmax.x - cli_aabbmin.x
              , y = cli_aabbmax.y - cli_aabbmin.y
              , z = cli_aabbmax.z - cli_aabbmin.z;
            target.x = 1 / 12 * mass * (2 * y * 2 * y + 2 * z * 2 * z),
            target.y = 1 / 12 * mass * (2 * x * 2 * x + 2 * z * 2 * z),
            target.z = 1 / 12 * mass * (2 * y * 2 * y + 2 * x * 2 * x)
        }
        ,
        ConvexPolyhedron.prototype.getPlaneConstantOfFace = function(face_i) {
            var f = this.faces[face_i]
              , n = this.faceNormals[face_i]
              , v = this.vertices[f[0]];
            return -n.dot(v)
        }
        ;
        var cfah_faceANormalWS = new Vec3
          , cfah_edge0 = new Vec3
          , cfah_WorldEdge0 = new Vec3
          , cfah_worldPlaneAnormal1 = new Vec3
          , cfah_planeNormalWS1 = new Vec3
          , cfah_worldA1 = new Vec3
          , cfah_localPlaneNormal = new Vec3
          , cfah_planeNormalWS = new Vec3;
        ConvexPolyhedron.prototype.clipFaceAgainstHull = function(separatingNormal, posA, quatA, worldVertsB1, minDist, maxDist, result) {
            for (var faceANormalWS = cfah_faceANormalWS, edge0 = cfah_edge0, WorldEdge0 = cfah_WorldEdge0, worldPlaneAnormal1 = cfah_worldPlaneAnormal1, planeNormalWS1 = cfah_planeNormalWS1, worldA1 = cfah_worldA1, localPlaneNormal = cfah_localPlaneNormal, planeNormalWS = cfah_planeNormalWS, hullA = this, pVtxIn = worldVertsB1, pVtxOut = [], closestFaceA = -1, dmin = Number.MAX_VALUE, face = 0; face < hullA.faces.length; face++) {
                faceANormalWS.copy(hullA.faceNormals[face]),
                quatA.vmult(faceANormalWS, faceANormalWS);
                var d = faceANormalWS.dot(separatingNormal);
                d < dmin && (dmin = d,
                closestFaceA = face)
            }
            if (!(closestFaceA < 0)) {
                var polyA = hullA.faces[closestFaceA];
                polyA.connectedFaces = [];
                for (i = 0; i < hullA.faces.length; i++)
                    for (var j = 0; j < hullA.faces[i].length; j++)
                        -1 !== polyA.indexOf(hullA.faces[i][j]) && i !== closestFaceA && -1 === polyA.connectedFaces.indexOf(i) && polyA.connectedFaces.push(i);
                pVtxIn.length;
                for (var numVerticesA = polyA.length, e0 = 0; e0 < numVerticesA; e0++) {
                    var a = hullA.vertices[polyA[e0]]
                      , b = hullA.vertices[polyA[(e0 + 1) % numVerticesA]];
                    a.vsub(b, edge0),
                    WorldEdge0.copy(edge0),
                    quatA.vmult(WorldEdge0, WorldEdge0),
                    posA.vadd(WorldEdge0, WorldEdge0),
                    worldPlaneAnormal1.copy(this.faceNormals[closestFaceA]),
                    quatA.vmult(worldPlaneAnormal1, worldPlaneAnormal1),
                    posA.vadd(worldPlaneAnormal1, worldPlaneAnormal1),
                    WorldEdge0.cross(worldPlaneAnormal1, planeNormalWS1),
                    planeNormalWS1.negate(planeNormalWS1),
                    worldA1.copy(a),
                    quatA.vmult(worldA1, worldA1),
                    posA.vadd(worldA1, worldA1);
                    worldA1.dot(planeNormalWS1);
                    var otherFace = polyA.connectedFaces[e0];
                    localPlaneNormal.copy(this.faceNormals[otherFace]);
                    localPlaneEq = this.getPlaneConstantOfFace(otherFace);
                    planeNormalWS.copy(localPlaneNormal),
                    quatA.vmult(planeNormalWS, planeNormalWS);
                    planeEqWS = localPlaneEq - planeNormalWS.dot(posA);
                    for (this.clipFaceAgainstPlane(pVtxIn, pVtxOut, planeNormalWS, planeEqWS); pVtxIn.length; )
                        pVtxIn.shift();
                    for (; pVtxOut.length; )
                        pVtxIn.push(pVtxOut.shift())
                }
                localPlaneNormal.copy(this.faceNormals[closestFaceA]);
                var localPlaneEq = this.getPlaneConstantOfFace(closestFaceA);
                planeNormalWS.copy(localPlaneNormal),
                quatA.vmult(planeNormalWS, planeNormalWS);
                for (var planeEqWS = localPlaneEq - planeNormalWS.dot(posA), i = 0; i < pVtxIn.length; i++) {
                    var depth = planeNormalWS.dot(pVtxIn[i]) + planeEqWS;
                    if (depth <= minDist && (console.log("clamped: depth=" + depth + " to minDist=" + minDist),
                    depth = minDist),
                    depth <= maxDist) {
                        var point = pVtxIn[i];
                        if (depth <= 0) {
                            var p = {
                                point: point,
                                normal: planeNormalWS,
                                depth: depth
                            };
                            result.push(p)
                        }
                    }
                }
            }
        }
        ,
        ConvexPolyhedron.prototype.clipFaceAgainstPlane = function(inVertices, outVertices, planeNormal, planeConstant) {
            var n_dot_first, n_dot_last, numVerts = inVertices.length;
            if (numVerts < 2)
                return outVertices;
            var firstVertex = inVertices[inVertices.length - 1]
              , lastVertex = inVertices[0];
            n_dot_first = planeNormal.dot(firstVertex) + planeConstant;
            for (var vi = 0; vi < numVerts; vi++) {
                if (lastVertex = inVertices[vi],
                n_dot_last = planeNormal.dot(lastVertex) + planeConstant,
                n_dot_first < 0)
                    if (n_dot_last < 0)
                        (newv = new Vec3).copy(lastVertex),
                        outVertices.push(newv);
                    else {
                        newv = new Vec3;
                        firstVertex.lerp(lastVertex, n_dot_first / (n_dot_first - n_dot_last), newv),
                        outVertices.push(newv)
                    }
                else if (n_dot_last < 0) {
                    var newv = new Vec3;
                    firstVertex.lerp(lastVertex, n_dot_first / (n_dot_first - n_dot_last), newv),
                    outVertices.push(newv),
                    outVertices.push(lastVertex)
                }
                firstVertex = lastVertex,
                n_dot_first = n_dot_last
            }
            return outVertices
        }
        ,
        ConvexPolyhedron.prototype.computeWorldVertices = function(position, quat) {
            for (var N = this.vertices.length; this.worldVertices.length < N; )
                this.worldVertices.push(new Vec3);
            for (var verts = this.vertices, worldVerts = this.worldVertices, i = 0; i !== N; i++)
                quat.vmult(verts[i], worldVerts[i]),
                position.vadd(worldVerts[i], worldVerts[i]);
            this.worldVerticesNeedsUpdate = !1
        }
        ;
        new Vec3;
        ConvexPolyhedron.prototype.computeLocalAABB = function(aabbmin, aabbmax) {
            var n = this.vertices.length
              , vertices = this.vertices;
            aabbmin.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE),
            aabbmax.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE);
            for (var i = 0; i < n; i++) {
                var v = vertices[i];
                v.x < aabbmin.x ? aabbmin.x = v.x : v.x > aabbmax.x && (aabbmax.x = v.x),
                v.y < aabbmin.y ? aabbmin.y = v.y : v.y > aabbmax.y && (aabbmax.y = v.y),
                v.z < aabbmin.z ? aabbmin.z = v.z : v.z > aabbmax.z && (aabbmax.z = v.z)
            }
        }
        ,
        ConvexPolyhedron.prototype.computeWorldFaceNormals = function(quat) {
            for (var N = this.faceNormals.length; this.worldFaceNormals.length < N; )
                this.worldFaceNormals.push(new Vec3);
            for (var normals = this.faceNormals, worldNormals = this.worldFaceNormals, i = 0; i !== N; i++)
                quat.vmult(normals[i], worldNormals[i]);
            this.worldFaceNormalsNeedsUpdate = !1
        }
        ,
        ConvexPolyhedron.prototype.updateBoundingSphereRadius = function() {
            for (var max2 = 0, verts = this.vertices, i = 0, N = verts.length; i !== N; i++) {
                var norm2 = verts[i].norm2();
                norm2 > max2 && (max2 = norm2)
            }
            this.boundingSphereRadius = Math.sqrt(max2)
        }
        ;
        var tempWorldVertex = new Vec3;
        ConvexPolyhedron.prototype.calculateWorldAABB = function(pos, quat, min, max) {
            for (var minx, miny, minz, maxx, maxy, maxz, n = this.vertices.length, verts = this.vertices, i = 0; i < n; i++) {
                tempWorldVertex.copy(verts[i]),
                quat.vmult(tempWorldVertex, tempWorldVertex),
                pos.vadd(tempWorldVertex, tempWorldVertex);
                var v = tempWorldVertex;
                v.x < minx || void 0 === minx ? minx = v.x : (v.x > maxx || void 0 === maxx) && (maxx = v.x),
                v.y < miny || void 0 === miny ? miny = v.y : (v.y > maxy || void 0 === maxy) && (maxy = v.y),
                v.z < minz || void 0 === minz ? minz = v.z : (v.z > maxz || void 0 === maxz) && (maxz = v.z)
            }
            min.set(minx, miny, minz),
            max.set(maxx, maxy, maxz)
        }
        ,
        ConvexPolyhedron.prototype.volume = function() {
            return 4 * Math.PI * this.boundingSphereRadius / 3
        }
        ,
        ConvexPolyhedron.prototype.getAveragePointLocal = function(target) {
            target = target || new Vec3;
            for (var n = this.vertices.length, verts = this.vertices, i = 0; i < n; i++)
                target.vadd(verts[i], target);
            return target.mult(1 / n, target),
            target
        }
        ,
        ConvexPolyhedron.prototype.transformAllPoints = function(offset, quat) {
            var n = this.vertices.length
              , verts = this.vertices;
            if (quat) {
                for (i = 0; i < n; i++) {
                    v = verts[i];
                    quat.vmult(v, v)
                }
                for (i = 0; i < this.faceNormals.length; i++) {
                    var v = this.faceNormals[i];
                    quat.vmult(v, v)
                }
            }
            if (offset)
                for (var i = 0; i < n; i++)
                    (v = verts[i]).vadd(offset, v)
        }
        ;
        var ConvexPolyhedron_pointIsInside = new Vec3
          , ConvexPolyhedron_vToP = new Vec3
          , ConvexPolyhedron_vToPointInside = new Vec3;
        ConvexPolyhedron.prototype.pointIsInside = function(p) {
            var n = this.vertices.length
              , verts = this.vertices
              , faces = this.faces
              , normals = this.faceNormals
              , N = this.faces.length
              , pointInside = ConvexPolyhedron_pointIsInside;
            this.getAveragePointLocal(pointInside);
            for (var i = 0; i < N; i++) {
                this.faces[i].length;
                var n = normals[i]
                  , v = verts[faces[i][0]]
                  , vToP = ConvexPolyhedron_vToP;
                p.vsub(v, vToP);
                var r1 = n.dot(vToP)
                  , vToPointInside = ConvexPolyhedron_vToPointInside;
                pointInside.vsub(v, vToPointInside);
                var r2 = n.dot(vToPointInside);
                if (r1 < 0 && r2 > 0 || r1 > 0 && r2 < 0)
                    return !1
            }
            return -1
        }
        ;
        new Vec3;
        var project_localAxis = new Vec3
          , project_localOrigin = new Vec3;
        ConvexPolyhedron.project = function(hull, axis, pos, quat, result) {
            var n = hull.vertices.length
              , localAxis = project_localAxis
              , max = 0
              , min = 0
              , localOrigin = project_localOrigin
              , vs = hull.vertices;
            localOrigin.setZero(),
            Transform.vectorToLocalFrame(pos, quat, axis, localAxis),
            Transform.pointToLocalFrame(pos, quat, localOrigin, localOrigin);
            var add = localOrigin.dot(localAxis);
            min = max = vs[0].dot(localAxis);
            for (var i = 1; i < n; i++) {
                var val = vs[i].dot(localAxis);
                val > max && (max = val),
                val < min && (min = val)
            }
            if (min -= add,
            max -= add,
            min > max) {
                var temp = min;
                min = max,
                max = temp
            }
            result[0] = max,
            result[1] = min
        }
    }
    , {
        "../math/Quaternion": 31,
        "../math/Transform": 32,
        "../math/Vec3": 33,
        "./Shape": 46
    }],
    42: [function(require, module, exports) {
        function Cylinder(radiusTop, radiusBottom, height, numSegments) {
            var N = numSegments
              , verts = []
              , axes = []
              , faces = []
              , bottomface = []
              , topface = []
              , cos = Math.cos
              , sin = Math.sin;
            verts.push(new Vec3(radiusBottom * cos(0),radiusBottom * sin(0),.5 * -height)),
            bottomface.push(0),
            verts.push(new Vec3(radiusTop * cos(0),radiusTop * sin(0),.5 * height)),
            topface.push(1);
            for (i = 0; i < N; i++) {
                var theta = 2 * Math.PI / N * (i + 1)
                  , thetaN = 2 * Math.PI / N * (i + .5);
                i < N - 1 ? (verts.push(new Vec3(radiusBottom * cos(theta),radiusBottom * sin(theta),.5 * -height)),
                bottomface.push(2 * i + 2),
                verts.push(new Vec3(radiusTop * cos(theta),radiusTop * sin(theta),.5 * height)),
                topface.push(2 * i + 3),
                faces.push([2 * i + 2, 2 * i + 3, 2 * i + 1, 2 * i])) : faces.push([0, 1, 2 * i + 1, 2 * i]),
                (N % 2 == 1 || i < N / 2) && axes.push(new Vec3(cos(thetaN),sin(thetaN),0))
            }
            faces.push(topface),
            axes.push(new Vec3(0,0,1));
            for (var temp = [], i = 0; i < bottomface.length; i++)
                temp.push(bottomface[bottomface.length - i - 1]);
            faces.push(temp),
            this.type = Shape.types.CONVEXPOLYHEDRON,
            ConvexPolyhedron.call(this, verts, faces, axes)
        }
        module.exports = Cylinder;
        var Shape = require("./Shape")
          , Vec3 = require("../math/Vec3")
          , ConvexPolyhedron = (require("../math/Quaternion"),
        require("./ConvexPolyhedron"));
        Cylinder.prototype = new ConvexPolyhedron
    }
    , {
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "./ConvexPolyhedron": 41,
        "./Shape": 46
    }],
    43: [function(require, module, exports) {
        function Heightfield(data, options) {
            options = Utils.defaults(options, {
                maxValue: null,
                minValue: null,
                elementSize: 1
            }),
            this.data = data,
            this.maxValue = options.maxValue,
            this.minValue = options.minValue,
            this.elementSize = options.elementSize,
            null === options.minValue && this.updateMinValue(),
            null === options.maxValue && this.updateMaxValue(),
            this.cacheEnabled = !0,
            Shape.call(this),
            this.pillarConvex = new ConvexPolyhedron,
            this.pillarOffset = new Vec3,
            this.type = Shape.types.HEIGHTFIELD,
            this.updateBoundingSphereRadius(),
            this._cachedPillars = {}
        }
        function barycentricWeights(x, y, ax, ay, bx, by, cx, cy, result) {
            result.x = ((by - cy) * (x - cx) + (cx - bx) * (y - cy)) / ((by - cy) * (ax - cx) + (cx - bx) * (ay - cy)),
            result.y = ((cy - ay) * (x - cx) + (ax - cx) * (y - cy)) / ((by - cy) * (ax - cx) + (cx - bx) * (ay - cy)),
            result.z = 1 - result.x - result.y
        }
        var Shape = require("./Shape")
          , ConvexPolyhedron = require("./ConvexPolyhedron")
          , Vec3 = require("../math/Vec3")
          , Utils = require("../utils/Utils");
        module.exports = Heightfield,
        Heightfield.prototype = new Shape,
        Heightfield.prototype.update = function() {
            this._cachedPillars = {}
        }
        ,
        Heightfield.prototype.updateMinValue = function() {
            for (var data = this.data, minValue = data[0][0], i = 0; i !== data.length; i++)
                for (var j = 0; j !== data[i].length; j++) {
                    var v = data[i][j];
                    v < minValue && (minValue = v)
                }
            this.minValue = minValue
        }
        ,
        Heightfield.prototype.updateMaxValue = function() {
            for (var data = this.data, maxValue = data[0][0], i = 0; i !== data.length; i++)
                for (var j = 0; j !== data[i].length; j++) {
                    var v = data[i][j];
                    v > maxValue && (maxValue = v)
                }
            this.maxValue = maxValue
        }
        ,
        Heightfield.prototype.setHeightValueAtIndex = function(xi, yi, value) {
            this.data[xi][yi] = value,
            this.clearCachedConvexTrianglePillar(xi, yi, !1),
            xi > 0 && (this.clearCachedConvexTrianglePillar(xi - 1, yi, !0),
            this.clearCachedConvexTrianglePillar(xi - 1, yi, !1)),
            yi > 0 && (this.clearCachedConvexTrianglePillar(xi, yi - 1, !0),
            this.clearCachedConvexTrianglePillar(xi, yi - 1, !1)),
            yi > 0 && xi > 0 && this.clearCachedConvexTrianglePillar(xi - 1, yi - 1, !0)
        }
        ,
        Heightfield.prototype.getRectMinMax = function(iMinX, iMinY, iMaxX, iMaxY, result) {
            result = result || [];
            for (var data = this.data, max = this.minValue, i = iMinX; i <= iMaxX; i++)
                for (var j = iMinY; j <= iMaxY; j++) {
                    var height = data[i][j];
                    height > max && (max = height)
                }
            result[0] = this.minValue,
            result[1] = max
        }
        ,
        Heightfield.prototype.getIndexOfPosition = function(x, y, result, clamp) {
            var w = this.elementSize
              , data = this.data
              , xi = Math.floor(x / w)
              , yi = Math.floor(y / w);
            return result[0] = xi,
            result[1] = yi,
            clamp && (xi < 0 && (xi = 0),
            yi < 0 && (yi = 0),
            xi >= data.length - 1 && (xi = data.length - 1),
            yi >= data[0].length - 1 && (yi = data[0].length - 1)),
            !(xi < 0 || yi < 0 || xi >= data.length - 1 || yi >= data[0].length - 1)
        }
        ;
        var getHeightAt_idx = []
          , getHeightAt_weights = new Vec3
          , getHeightAt_a = new Vec3
          , getHeightAt_b = new Vec3
          , getHeightAt_c = new Vec3;
        Heightfield.prototype.getTriangleAt = function(x, y, edgeClamp, a, b, c) {
            var idx = getHeightAt_idx;
            this.getIndexOfPosition(x, y, idx, edgeClamp);
            var xi = idx[0]
              , yi = idx[1]
              , data = this.data;
            edgeClamp && (xi = Math.min(data.length - 2, Math.max(0, xi)),
            yi = Math.min(data[0].length - 2, Math.max(0, yi)));
            var elementSize = this.elementSize
              , upper = Math.pow(x / elementSize - xi, 2) + Math.pow(y / elementSize - yi, 2) > Math.pow(x / elementSize - (xi + 1), 2) + Math.pow(y / elementSize - (yi + 1), 2);
            return this.getTriangle(xi, yi, upper, a, b, c),
            upper
        }
        ;
        var getNormalAt_a = new Vec3
          , getNormalAt_b = new Vec3
          , getNormalAt_c = new Vec3
          , getNormalAt_e0 = new Vec3
          , getNormalAt_e1 = new Vec3;
        Heightfield.prototype.getNormalAt = function(x, y, edgeClamp, result) {
            var a = getNormalAt_a
              , b = getNormalAt_b
              , c = getNormalAt_c
              , e0 = getNormalAt_e0
              , e1 = getNormalAt_e1;
            this.getTriangleAt(x, y, edgeClamp, a, b, c),
            b.vsub(a, e0),
            c.vsub(a, e1),
            e0.cross(e1, result),
            result.normalize()
        }
        ,
        Heightfield.prototype.getAabbAtIndex = function(xi, yi, result) {
            var data = this.data
              , elementSize = this.elementSize;
            result.lowerBound.set(xi * elementSize, yi * elementSize, data[xi][yi]),
            result.upperBound.set((xi + 1) * elementSize, (yi + 1) * elementSize, data[xi + 1][yi + 1])
        }
        ,
        Heightfield.prototype.getHeightAt = function(x, y, edgeClamp) {
            var data = this.data
              , a = getHeightAt_a
              , b = getHeightAt_b
              , c = getHeightAt_c
              , idx = getHeightAt_idx;
            this.getIndexOfPosition(x, y, idx, edgeClamp);
            var xi = idx[0]
              , yi = idx[1];
            edgeClamp && (xi = Math.min(data.length - 2, Math.max(0, xi)),
            yi = Math.min(data[0].length - 2, Math.max(0, yi)));
            var upper = this.getTriangleAt(x, y, edgeClamp, a, b, c);
            barycentricWeights(x, y, a.x, a.y, b.x, b.y, c.x, c.y, getHeightAt_weights);
            var w = getHeightAt_weights;
            return upper ? data[xi + 1][yi + 1] * w.x + data[xi][yi + 1] * w.y + data[xi + 1][yi] * w.z : data[xi][yi] * w.x + data[xi + 1][yi] * w.y + data[xi][yi + 1] * w.z
        }
        ,
        Heightfield.prototype.getCacheConvexTrianglePillarKey = function(xi, yi, getUpperTriangle) {
            return xi + "_" + yi + "_" + (getUpperTriangle ? 1 : 0)
        }
        ,
        Heightfield.prototype.getCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle) {
            return this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)]
        }
        ,
        Heightfield.prototype.setCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle, convex, offset) {
            this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)] = {
                convex: convex,
                offset: offset
            }
        }
        ,
        Heightfield.prototype.clearCachedConvexTrianglePillar = function(xi, yi, getUpperTriangle) {
            delete this._cachedPillars[this.getCacheConvexTrianglePillarKey(xi, yi, getUpperTriangle)]
        }
        ,
        Heightfield.prototype.getTriangle = function(xi, yi, upper, a, b, c) {
            var data = this.data
              , elementSize = this.elementSize;
            upper ? (a.set((xi + 1) * elementSize, (yi + 1) * elementSize, data[xi + 1][yi + 1]),
            b.set(xi * elementSize, (yi + 1) * elementSize, data[xi][yi + 1]),
            c.set((xi + 1) * elementSize, yi * elementSize, data[xi + 1][yi])) : (a.set(xi * elementSize, yi * elementSize, data[xi][yi]),
            b.set((xi + 1) * elementSize, yi * elementSize, data[xi + 1][yi]),
            c.set(xi * elementSize, (yi + 1) * elementSize, data[xi][yi + 1]))
        }
        ,
        Heightfield.prototype.getConvexTrianglePillar = function(xi, yi, getUpperTriangle) {
            var result = this.pillarConvex
              , offsetResult = this.pillarOffset;
            if (this.cacheEnabled) {
                if (data = this.getCachedConvexTrianglePillar(xi, yi, getUpperTriangle))
                    return this.pillarConvex = data.convex,
                    void (this.pillarOffset = data.offset);
                result = new ConvexPolyhedron,
                offsetResult = new Vec3,
                this.pillarConvex = result,
                this.pillarOffset = offsetResult
            }
            var data = this.data
              , elementSize = this.elementSize
              , faces = result.faces;
            result.vertices.length = 6;
            for (i = 0; i < 6; i++)
                result.vertices[i] || (result.vertices[i] = new Vec3);
            faces.length = 5;
            for (var i = 0; i < 5; i++)
                faces[i] || (faces[i] = []);
            var verts = result.vertices
              , h = (Math.min(data[xi][yi], data[xi + 1][yi], data[xi][yi + 1], data[xi + 1][yi + 1]) - this.minValue) / 2 + this.minValue;
            getUpperTriangle ? (offsetResult.set((xi + .75) * elementSize, (yi + .75) * elementSize, h),
            verts[0].set(.25 * elementSize, .25 * elementSize, data[xi + 1][yi + 1] - h),
            verts[1].set(-.75 * elementSize, .25 * elementSize, data[xi][yi + 1] - h),
            verts[2].set(.25 * elementSize, -.75 * elementSize, data[xi + 1][yi] - h),
            verts[3].set(.25 * elementSize, .25 * elementSize, -h - 1),
            verts[4].set(-.75 * elementSize, .25 * elementSize, -h - 1),
            verts[5].set(.25 * elementSize, -.75 * elementSize, -h - 1),
            faces[0][0] = 0,
            faces[0][1] = 1,
            faces[0][2] = 2,
            faces[1][0] = 5,
            faces[1][1] = 4,
            faces[1][2] = 3,
            faces[2][0] = 2,
            faces[2][1] = 5,
            faces[2][2] = 3,
            faces[2][3] = 0,
            faces[3][0] = 3,
            faces[3][1] = 4,
            faces[3][2] = 1,
            faces[3][3] = 0,
            faces[4][0] = 1,
            faces[4][1] = 4,
            faces[4][2] = 5,
            faces[4][3] = 2) : (offsetResult.set((xi + .25) * elementSize, (yi + .25) * elementSize, h),
            verts[0].set(-.25 * elementSize, -.25 * elementSize, data[xi][yi] - h),
            verts[1].set(.75 * elementSize, -.25 * elementSize, data[xi + 1][yi] - h),
            verts[2].set(-.25 * elementSize, .75 * elementSize, data[xi][yi + 1] - h),
            verts[3].set(-.25 * elementSize, -.25 * elementSize, -h - 1),
            verts[4].set(.75 * elementSize, -.25 * elementSize, -h - 1),
            verts[5].set(-.25 * elementSize, .75 * elementSize, -h - 1),
            faces[0][0] = 0,
            faces[0][1] = 1,
            faces[0][2] = 2,
            faces[1][0] = 5,
            faces[1][1] = 4,
            faces[1][2] = 3,
            faces[2][0] = 0,
            faces[2][1] = 2,
            faces[2][2] = 5,
            faces[2][3] = 3,
            faces[3][0] = 1,
            faces[3][1] = 0,
            faces[3][2] = 3,
            faces[3][3] = 4,
            faces[4][0] = 4,
            faces[4][1] = 5,
            faces[4][2] = 2,
            faces[4][3] = 1),
            result.computeNormals(),
            result.computeEdges(),
            result.updateBoundingSphereRadius(),
            this.setCachedConvexTrianglePillar(xi, yi, getUpperTriangle, result, offsetResult)
        }
        ,
        Heightfield.prototype.calculateLocalInertia = function(mass, target) {
            return (target = target || new Vec3).set(0, 0, 0),
            target
        }
        ,
        Heightfield.prototype.volume = function() {
            return Number.MAX_VALUE
        }
        ,
        Heightfield.prototype.calculateWorldAABB = function(pos, quat, min, max) {
            min.set(-Number.MAX_VALUE, -Number.MAX_VALUE, -Number.MAX_VALUE),
            max.set(Number.MAX_VALUE, Number.MAX_VALUE, Number.MAX_VALUE)
        }
        ,
        Heightfield.prototype.updateBoundingSphereRadius = function() {
            var data = this.data
              , s = this.elementSize;
            this.boundingSphereRadius = new Vec3(data.length * s,data[0].length * s,Math.max(Math.abs(this.maxValue), Math.abs(this.minValue))).norm()
        }
        ,
        Heightfield.prototype.setHeightsFromImage = function(image, scale) {
            var canvas = document.createElement("canvas");
            canvas.width = image.width,
            canvas.height = image.height;
            var context = canvas.getContext("2d");
            context.drawImage(image, 0, 0);
            var imageData = context.getImageData(0, 0, image.width, image.height)
              , matrix = this.data;
            matrix.length = 0,
            this.elementSize = Math.abs(scale.x) / imageData.width;
            for (var i = 0; i < imageData.height; i++) {
                for (var row = [], j = 0; j < imageData.width; j++) {
                    var height = (imageData.data[4 * (i * imageData.height + j)] + imageData.data[4 * (i * imageData.height + j) + 1] + imageData.data[4 * (i * imageData.height + j) + 2]) / 4 / 255 * scale.z;
                    scale.x < 0 ? row.push(height) : row.unshift(height)
                }
                scale.y < 0 ? matrix.unshift(row) : matrix.push(row)
            }
            this.updateMaxValue(),
            this.updateMinValue(),
            this.update()
        }
    }
    , {
        "../math/Vec3": 33,
        "../utils/Utils": 56,
        "./ConvexPolyhedron": 41,
        "./Shape": 46
    }],
    44: [function(require, module, exports) {
        function Particle() {
            Shape.call(this),
            this.type = Shape.types.PARTICLE
        }
        module.exports = Particle;
        var Shape = require("./Shape")
          , Vec3 = require("../math/Vec3");
        Particle.prototype = new Shape,
        Particle.prototype.constructor = Particle,
        Particle.prototype.calculateLocalInertia = function(mass, target) {
            return (target = target || new Vec3).set(0, 0, 0),
            target
        }
        ,
        Particle.prototype.volume = function() {
            return 0
        }
        ,
        Particle.prototype.updateBoundingSphereRadius = function() {
            this.boundingSphereRadius = 0
        }
        ,
        Particle.prototype.calculateWorldAABB = function(pos, quat, min, max) {
            min.copy(pos),
            max.copy(pos)
        }
    }
    , {
        "../math/Vec3": 33,
        "./Shape": 46
    }],
    45: [function(require, module, exports) {
        function Plane() {
            Shape.call(this),
            this.type = Shape.types.PLANE,
            this.worldNormal = new Vec3,
            this.worldNormalNeedsUpdate = !0,
            this.boundingSphereRadius = Number.MAX_VALUE
        }
        module.exports = Plane;
        var Shape = require("./Shape")
          , Vec3 = require("../math/Vec3");
        Plane.prototype = new Shape,
        Plane.prototype.constructor = Plane,
        Plane.prototype.computeWorldNormal = function(quat) {
            var n = this.worldNormal;
            n.set(0, 0, 1),
            quat.vmult(n, n),
            this.worldNormalNeedsUpdate = !1
        }
        ,
        Plane.prototype.calculateLocalInertia = function(mass, target) {
            return target = target || new Vec3
        }
        ,
        Plane.prototype.volume = function() {
            return Number.MAX_VALUE
        }
        ;
        var tempNormal = new Vec3;
        Plane.prototype.calculateWorldAABB = function(pos, quat, min, max) {
            tempNormal.set(0, 0, 1),
            quat.vmult(tempNormal, tempNormal);
            var maxVal = Number.MAX_VALUE;
            min.set(-maxVal, -maxVal, -maxVal),
            max.set(maxVal, maxVal, maxVal),
            1 === tempNormal.x && (max.x = pos.x),
            1 === tempNormal.y && (max.y = pos.y),
            1 === tempNormal.z && (max.z = pos.z),
            -1 === tempNormal.x && (min.x = pos.x),
            -1 === tempNormal.y && (min.y = pos.y),
            -1 === tempNormal.z && (min.z = pos.z)
        }
        ,
        Plane.prototype.updateBoundingSphereRadius = function() {
            this.boundingSphereRadius = Number.MAX_VALUE
        }
    }
    , {
        "../math/Vec3": 33,
        "./Shape": 46
    }],
    46: [function(require, module, exports) {
        function Shape() {
            this.id = Shape.idCounter++,
            this.type = 0,
            this.boundingSphereRadius = 0,
            this.collisionResponse = !0,
            this.material = null,
            this.body = null
        }
        module.exports = Shape;
        var Shape = require("./Shape");
        require("../math/Vec3"),
        require("../math/Quaternion"),
        require("../material/Material");
        Shape.prototype.constructor = Shape,
        Shape.prototype.updateBoundingSphereRadius = function() {
            throw "computeBoundingSphereRadius() not implemented for shape type " + this.type
        }
        ,
        Shape.prototype.volume = function() {
            throw "volume() not implemented for shape type " + this.type
        }
        ,
        Shape.prototype.calculateLocalInertia = function(mass, target) {
            throw "calculateLocalInertia() not implemented for shape type " + this.type
        }
        ,
        Shape.idCounter = 0,
        Shape.types = {
            SPHERE: 1,
            PLANE: 2,
            BOX: 4,
            COMPOUND: 8,
            CONVEXPOLYHEDRON: 16,
            HEIGHTFIELD: 32,
            PARTICLE: 64,
            CYLINDER: 128,
            TRIMESH: 256
        }
    }
    , {
        "../material/Material": 28,
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "./Shape": 46
    }],
    47: [function(require, module, exports) {
        function Sphere(radius) {
            if (Shape.call(this),
            this.radius = void 0 !== radius ? Number(radius) : 1,
            this.type = Shape.types.SPHERE,
            this.radius < 0)
                throw new Error("The sphere radius cannot be negative.");
            this.updateBoundingSphereRadius()
        }
        module.exports = Sphere;
        var Shape = require("./Shape")
          , Vec3 = require("../math/Vec3");
        Sphere.prototype = new Shape,
        Sphere.prototype.constructor = Sphere,
        Sphere.prototype.calculateLocalInertia = function(mass, target) {
            target = target || new Vec3;
            var I = 2 * mass * this.radius * this.radius / 5;
            return target.x = I,
            target.y = I,
            target.z = I,
            target
        }
        ,
        Sphere.prototype.volume = function() {
            return 4 * Math.PI * this.radius / 3
        }
        ,
        Sphere.prototype.updateBoundingSphereRadius = function() {
            this.boundingSphereRadius = this.radius
        }
        ,
        Sphere.prototype.calculateWorldAABB = function(pos, quat, min, max) {
            for (var r = this.radius, axes = ["x", "y", "z"], i = 0; i < axes.length; i++) {
                var ax = axes[i];
                min[ax] = pos[ax] - r,
                max[ax] = pos[ax] + r
            }
        }
    }
    , {
        "../math/Vec3": 33,
        "./Shape": 46
    }],
    48: [function(require, module, exports) {
        function Trimesh(vertices, indices) {
            Shape.call(this),
            this.type = Shape.types.TRIMESH,
            this.vertices = new Float32Array(vertices),
            this.indices = new Int16Array(indices),
            this.normals = new Float32Array(indices.length),
            this.aabb = new AABB,
            this.edges = null,
            this.scale = new Vec3(1,1,1),
            this.tree = new Octree,
            this.updateEdges(),
            this.updateNormals(),
            this.updateAABB(),
            this.updateBoundingSphereRadius(),
            this.updateTree()
        }
        module.exports = Trimesh;
        var Shape = require("./Shape")
          , Vec3 = require("../math/Vec3")
          , Transform = (require("../math/Quaternion"),
        require("../math/Transform"))
          , AABB = require("../collision/AABB")
          , Octree = require("../utils/Octree");
        Trimesh.prototype = new Shape,
        Trimesh.prototype.constructor = Trimesh;
        var computeNormals_n = new Vec3;
        Trimesh.prototype.updateTree = function() {
            var tree = this.tree;
            tree.reset(),
            tree.aabb.copy(this.aabb);
            var scale = this.scale;
            tree.aabb.lowerBound.x *= 1 / scale.x,
            tree.aabb.lowerBound.y *= 1 / scale.y,
            tree.aabb.lowerBound.z *= 1 / scale.z,
            tree.aabb.upperBound.x *= 1 / scale.x,
            tree.aabb.upperBound.y *= 1 / scale.y,
            tree.aabb.upperBound.z *= 1 / scale.z;
            for (var triangleAABB = new AABB, a = new Vec3, b = new Vec3, c = new Vec3, points = [a, b, c], i = 0; i < this.indices.length / 3; i++) {
                var i3 = 3 * i;
                this._getUnscaledVertex(this.indices[i3], a),
                this._getUnscaledVertex(this.indices[i3 + 1], b),
                this._getUnscaledVertex(this.indices[i3 + 2], c),
                triangleAABB.setFromPoints(points),
                tree.insert(triangleAABB, i)
            }
            tree.removeEmptyNodes()
        }
        ;
        var unscaledAABB = new AABB;
        Trimesh.prototype.getTrianglesInAABB = function(aabb, result) {
            unscaledAABB.copy(aabb);
            var scale = this.scale
              , isx = scale.x
              , isy = scale.y
              , isz = scale.z
              , l = unscaledAABB.lowerBound
              , u = unscaledAABB.upperBound;
            return l.x /= isx,
            l.y /= isy,
            l.z /= isz,
            u.x /= isx,
            u.y /= isy,
            u.z /= isz,
            this.tree.aabbQuery(unscaledAABB, result)
        }
        ,
        Trimesh.prototype.setScale = function(scale) {
            var wasUniform = this.scale.x === this.scale.y === this.scale.z
              , isUniform = scale.x === scale.y === scale.z;
            wasUniform && isUniform || this.updateNormals(),
            this.scale.copy(scale),
            this.updateAABB(),
            this.updateBoundingSphereRadius()
        }
        ,
        Trimesh.prototype.updateNormals = function() {
            for (var n = computeNormals_n, normals = this.normals, i = 0; i < this.indices.length / 3; i++) {
                var i3 = 3 * i
                  , a = this.indices[i3]
                  , b = this.indices[i3 + 1]
                  , c = this.indices[i3 + 2];
                this.getVertex(a, va),
                this.getVertex(b, vb),
                this.getVertex(c, vc),
                Trimesh.computeNormal(vb, va, vc, n),
                normals[i3] = n.x,
                normals[i3 + 1] = n.y,
                normals[i3 + 2] = n.z
            }
        }
        ,
        Trimesh.prototype.updateEdges = function() {
            for (var edges = {}, add = function(indexA, indexB) {
                edges[a < b ? a + "_" + b : b + "_" + a] = !0
            }, i = 0; i < this.indices.length / 3; i++) {
                var i3 = 3 * i
                  , a = this.indices[i3]
                  , b = this.indices[i3 + 1];
                this.indices[i3 + 2];
                add(),
                add(),
                add()
            }
            var keys = Object.keys(edges);
            this.edges = new Int16Array(2 * keys.length);
            for (i = 0; i < keys.length; i++) {
                var indices = keys[i].split("_");
                this.edges[2 * i] = parseInt(indices[0], 10),
                this.edges[2 * i + 1] = parseInt(indices[1], 10)
            }
        }
        ,
        Trimesh.prototype.getEdgeVertex = function(edgeIndex, firstOrSecond, vertexStore) {
            var vertexIndex = this.edges[2 * edgeIndex + (firstOrSecond ? 1 : 0)];
            this.getVertex(vertexIndex, vertexStore)
        }
        ;
        var getEdgeVector_va = new Vec3
          , getEdgeVector_vb = new Vec3;
        Trimesh.prototype.getEdgeVector = function(edgeIndex, vectorStore) {
            var va = getEdgeVector_va
              , vb = getEdgeVector_vb;
            this.getEdgeVertex(edgeIndex, 0, va),
            this.getEdgeVertex(edgeIndex, 1, vb),
            vb.vsub(va, vectorStore)
        }
        ;
        var cb = new Vec3
          , ab = new Vec3;
        Trimesh.computeNormal = function(va, vb, vc, target) {
            vb.vsub(va, ab),
            vc.vsub(vb, cb),
            cb.cross(ab, target),
            target.isZero() || target.normalize()
        }
        ;
        var va = new Vec3
          , vb = new Vec3
          , vc = new Vec3;
        Trimesh.prototype.getVertex = function(i, out) {
            var scale = this.scale;
            return this._getUnscaledVertex(i, out),
            out.x *= scale.x,
            out.y *= scale.y,
            out.z *= scale.z,
            out
        }
        ,
        Trimesh.prototype._getUnscaledVertex = function(i, out) {
            var i3 = 3 * i
              , vertices = this.vertices;
            return out.set(vertices[i3], vertices[i3 + 1], vertices[i3 + 2])
        }
        ,
        Trimesh.prototype.getWorldVertex = function(i, pos, quat, out) {
            return this.getVertex(i, out),
            Transform.pointToWorldFrame(pos, quat, out, out),
            out
        }
        ,
        Trimesh.prototype.getTriangleVertices = function(i, a, b, c) {
            var i3 = 3 * i;
            this.getVertex(this.indices[i3], a),
            this.getVertex(this.indices[i3 + 1], b),
            this.getVertex(this.indices[i3 + 2], c)
        }
        ,
        Trimesh.prototype.getNormal = function(i, target) {
            var i3 = 3 * i;
            return target.set(this.normals[i3], this.normals[i3 + 1], this.normals[i3 + 2])
        }
        ;
        var cli_aabb = new AABB;
        Trimesh.prototype.calculateLocalInertia = function(mass, target) {
            this.computeLocalAABB(cli_aabb);
            var x = cli_aabb.upperBound.x - cli_aabb.lowerBound.x
              , y = cli_aabb.upperBound.y - cli_aabb.lowerBound.y
              , z = cli_aabb.upperBound.z - cli_aabb.lowerBound.z;
            return target.set(1 / 12 * mass * (2 * y * 2 * y + 2 * z * 2 * z), 1 / 12 * mass * (2 * x * 2 * x + 2 * z * 2 * z), 1 / 12 * mass * (2 * y * 2 * y + 2 * x * 2 * x))
        }
        ;
        var computeLocalAABB_worldVert = new Vec3;
        Trimesh.prototype.computeLocalAABB = function(aabb) {
            var l = aabb.lowerBound
              , u = aabb.upperBound
              , n = this.vertices.length
              , v = (this.vertices,
            computeLocalAABB_worldVert);
            this.getVertex(0, v),
            l.copy(v),
            u.copy(v);
            for (var i = 0; i !== n; i++)
                this.getVertex(i, v),
                v.x < l.x ? l.x = v.x : v.x > u.x && (u.x = v.x),
                v.y < l.y ? l.y = v.y : v.y > u.y && (u.y = v.y),
                v.z < l.z ? l.z = v.z : v.z > u.z && (u.z = v.z)
        }
        ,
        Trimesh.prototype.updateAABB = function() {
            this.computeLocalAABB(this.aabb)
        }
        ,
        Trimesh.prototype.updateBoundingSphereRadius = function() {
            for (var max2 = 0, vertices = this.vertices, v = new Vec3, i = 0, N = vertices.length / 3; i !== N; i++) {
                this.getVertex(i, v);
                var norm2 = v.norm2();
                norm2 > max2 && (max2 = norm2)
            }
            this.boundingSphereRadius = Math.sqrt(max2)
        }
        ;
        new Vec3;
        var calculateWorldAABB_frame = new Transform
          , calculateWorldAABB_aabb = new AABB;
        Trimesh.prototype.calculateWorldAABB = function(pos, quat, min, max) {
            var frame = calculateWorldAABB_frame
              , result = calculateWorldAABB_aabb;
            frame.position = pos,
            frame.quaternion = quat,
            this.aabb.toWorldFrame(frame, result),
            min.copy(result.lowerBound),
            max.copy(result.upperBound)
        }
        ,
        Trimesh.prototype.volume = function() {
            return 4 * Math.PI * this.boundingSphereRadius / 3
        }
        ,
        Trimesh.createTorus = function(radius, tube, radialSegments, tubularSegments, arc) {
            radius = radius || 1,
            tube = tube || .5,
            radialSegments = radialSegments || 8,
            tubularSegments = tubularSegments || 6,
            arc = arc || 2 * Math.PI;
            for (var vertices = [], indices = [], j = 0; j <= radialSegments; j++)
                for (i = 0; i <= tubularSegments; i++) {
                    var u = i / tubularSegments * arc
                      , v = j / radialSegments * Math.PI * 2
                      , x = (radius + tube * Math.cos(v)) * Math.cos(u)
                      , y = (radius + tube * Math.cos(v)) * Math.sin(u)
                      , z = tube * Math.sin(v);
                    vertices.push(x, y, z)
                }
            for (j = 1; j <= radialSegments; j++)
                for (var i = 1; i <= tubularSegments; i++) {
                    var a = (tubularSegments + 1) * j + i - 1
                      , b = (tubularSegments + 1) * (j - 1) + i - 1
                      , c = (tubularSegments + 1) * (j - 1) + i
                      , d = (tubularSegments + 1) * j + i;
                    indices.push(a, b, d),
                    indices.push(b, c, d)
                }
            return new Trimesh(vertices,indices)
        }
    }
    , {
        "../collision/AABB": 5,
        "../math/Quaternion": 31,
        "../math/Transform": 32,
        "../math/Vec3": 33,
        "../utils/Octree": 53,
        "./Shape": 46
    }],
    49: [function(require, module, exports) {
        function GSSolver() {
            Solver.call(this),
            this.iterations = 10,
            this.tolerance = 1e-7
        }
        module.exports = GSSolver;
        require("../math/Vec3"),
        require("../math/Quaternion");
        var Solver = require("./Solver");
        GSSolver.prototype = new Solver;
        var GSSolver_solve_lambda = []
          , GSSolver_solve_invCs = []
          , GSSolver_solve_Bs = [];
        GSSolver.prototype.solve = function(dt, world) {
            var B, invC, deltalambda, deltalambdaTot, lambdaj, iter = 0, maxIter = this.iterations, tolSquared = this.tolerance * this.tolerance, equations = this.equations, Neq = equations.length, bodies = world.bodies, Nbodies = bodies.length, h = dt;
            if (0 !== Neq)
                for (i = 0; i !== Nbodies; i++)
                    bodies[i].updateSolveMassProperties();
            var invCs = GSSolver_solve_invCs
              , Bs = GSSolver_solve_Bs
              , lambda = GSSolver_solve_lambda;
            invCs.length = Neq,
            Bs.length = Neq,
            lambda.length = Neq;
            for (i = 0; i !== Neq; i++) {
                c = equations[i];
                lambda[i] = 0,
                Bs[i] = c.computeB(h),
                invCs[i] = 1 / c.computeC()
            }
            if (0 !== Neq) {
                for (i = 0; i !== Nbodies; i++) {
                    var vlambda = (b = bodies[i]).vlambda
                      , wlambda = b.wlambda;
                    vlambda.set(0, 0, 0),
                    wlambda.set(0, 0, 0)
                }
                for (iter = 0; iter !== maxIter; iter++) {
                    deltalambdaTot = 0;
                    for (var j = 0; j !== Neq; j++) {
                        var c = equations[j];
                        B = Bs[j],
                        invC = invCs[j],
                        (lambdaj = lambda[j]) + (deltalambda = invC * (B - c.computeGWlambda() - c.eps * lambdaj)) < c.minForce ? deltalambda = c.minForce - lambdaj : lambdaj + deltalambda > c.maxForce && (deltalambda = c.maxForce - lambdaj),
                        lambda[j] += deltalambda,
                        deltalambdaTot += deltalambda > 0 ? deltalambda : -deltalambda,
                        c.addToWlambda(deltalambda)
                    }
                    if (deltalambdaTot * deltalambdaTot < tolSquared)
                        break
                }
                for (var i = 0; i !== Nbodies; i++) {
                    var b = bodies[i]
                      , v = b.velocity
                      , w = b.angularVelocity;
                    b.vlambda.vmul(b.linearFactor, b.vlambda),
                    v.vadd(b.vlambda, v),
                    b.wlambda.vmul(b.angularFactor, b.wlambda),
                    w.vadd(b.wlambda, w)
                }
                for (var l = equations.length, invDt = 1 / h; l--; )
                    equations[l].multiplier = lambda[l] * invDt
            }
            return iter
        }
    }
    , {
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "./Solver": 50
    }],
    50: [function(require, module, exports) {
        function Solver() {
            this.equations = []
        }
        module.exports = Solver,
        Solver.prototype.solve = function(dt, world) {
            return 0
        }
        ,
        Solver.prototype.addEquation = function(eq) {
            eq.enabled && this.equations.push(eq)
        }
        ,
        Solver.prototype.removeEquation = function(eq) {
            var eqs = this.equations
              , i = eqs.indexOf(eq);
            -1 !== i && eqs.splice(i, 1)
        }
        ,
        Solver.prototype.removeAllEquations = function() {
            this.equations.length = 0
        }
    }
    , {}],
    51: [function(require, module, exports) {
        function SplitSolver(subsolver) {
            for (Solver.call(this),
            this.iterations = 10,
            this.tolerance = 1e-7,
            this.subsolver = subsolver,
            this.nodes = [],
            this.nodePool = []; this.nodePool.length < 128; )
                this.nodePool.push(this.createNode())
        }
        function getUnvisitedNode(nodes) {
            for (var Nnodes = nodes.length, i = 0; i !== Nnodes; i++) {
                var node = nodes[i];
                if (!(node.visited || node.body.type & STATIC))
                    return node
            }
            return !1
        }
        function bfs(root, visitFunc, bds, eqs) {
            for (queue.push(root),
            root.visited = !0,
            visitFunc(root, bds, eqs); queue.length; )
                for (var child, node = queue.pop(); child = getUnvisitedNode(node.children); )
                    child.visited = !0,
                    visitFunc(child, bds, eqs),
                    queue.push(child)
        }
        function visitFunc(node, bds, eqs) {
            bds.push(node.body);
            for (var Neqs = node.eqs.length, i = 0; i !== Neqs; i++) {
                var eq = node.eqs[i];
                -1 === eqs.indexOf(eq) && eqs.push(eq)
            }
        }
        function sortById(a, b) {
            return b.id - a.id
        }
        module.exports = SplitSolver;
        require("../math/Vec3"),
        require("../math/Quaternion");
        var Solver = require("./Solver")
          , Body = require("../objects/Body");
        SplitSolver.prototype = new Solver;
        var SplitSolver_solve_nodes = []
          , SplitSolver_solve_eqs = []
          , SplitSolver_solve_dummyWorld = {
            bodies: []
        }
          , STATIC = Body.STATIC
          , queue = [];
        SplitSolver.prototype.createNode = function() {
            return {
                body: null,
                children: [],
                eqs: [],
                visited: !1
            }
        }
        ,
        SplitSolver.prototype.solve = function(dt, world) {
            for (var nodes = SplitSolver_solve_nodes, nodePool = this.nodePool, bodies = world.bodies, equations = this.equations, Neq = equations.length, Nbodies = bodies.length, subsolver = this.subsolver; nodePool.length < Nbodies; )
                nodePool.push(this.createNode());
            nodes.length = Nbodies;
            for (i = 0; i < Nbodies; i++)
                nodes[i] = nodePool[i];
            for (i = 0; i !== Nbodies; i++) {
                var node = nodes[i];
                node.body = bodies[i],
                node.children.length = 0,
                node.eqs.length = 0,
                node.visited = !1
            }
            for (var k = 0; k !== Neq; k++) {
                var eq = equations[k]
                  , i = bodies.indexOf(eq.bi)
                  , j = bodies.indexOf(eq.bj)
                  , ni = nodes[i]
                  , nj = nodes[j];
                ni.children.push(nj),
                ni.eqs.push(eq),
                nj.children.push(ni),
                nj.eqs.push(eq)
            }
            var child, n = 0, eqs = SplitSolver_solve_eqs;
            subsolver.tolerance = this.tolerance,
            subsolver.iterations = this.iterations;
            for (var dummyWorld = SplitSolver_solve_dummyWorld; child = getUnvisitedNode(nodes); ) {
                eqs.length = 0,
                dummyWorld.bodies.length = 0,
                bfs(child, visitFunc, dummyWorld.bodies, eqs);
                var Neqs = eqs.length;
                eqs = eqs.sort(sortById);
                for (i = 0; i !== Neqs; i++)
                    subsolver.addEquation(eqs[i]);
                subsolver.solve(dt, dummyWorld);
                subsolver.removeAllEquations(),
                n++
            }
            return n
        }
    }
    , {
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "../objects/Body": 34,
        "./Solver": 50
    }],
    52: [function(require, module, exports) {
        var EventTarget = function() {};
        module.exports = EventTarget,
        EventTarget.prototype = {
            constructor: EventTarget,
            addEventListener: function(type, listener) {
                void 0 === this._listeners && (this._listeners = {});
                var listeners = this._listeners;
                return void 0 === listeners[type] && (listeners[type] = []),
                -1 === listeners[type].indexOf(listener) && listeners[type].push(listener),
                this
            },
            hasEventListener: function(type, listener) {
                if (void 0 === this._listeners)
                    return !1;
                var listeners = this._listeners;
                return void 0 !== listeners[type] && -1 !== listeners[type].indexOf(listener)
            },
            hasAnyEventListener: function(type) {
                return void 0 !== this._listeners && void 0 !== this._listeners[type]
            },
            removeEventListener: function(type, listener) {
                if (void 0 === this._listeners)
                    return this;
                var listeners = this._listeners;
                if (void 0 === listeners[type])
                    return this;
                var index = listeners[type].indexOf(listener);
                return -1 !== index && listeners[type].splice(index, 1),
                this
            },
            dispatchEvent: function(event) {
                if (void 0 === this._listeners)
                    return this;
                var listenerArray = this._listeners[event.type];
                if (void 0 !== listenerArray) {
                    event.target = this;
                    for (var i = 0, l = listenerArray.length; i < l; i++)
                        listenerArray[i].call(this, event)
                }
                return this
            }
        }
    }
    , {}],
    53: [function(require, module, exports) {
        function OctreeNode(options) {
            options = options || {},
            this.root = options.root || null,
            this.aabb = options.aabb ? options.aabb.clone() : new AABB,
            this.data = [],
            this.children = []
        }
        function Octree(aabb, options) {
            (options = options || {}).root = null,
            options.aabb = aabb,
            OctreeNode.call(this, options),
            this.maxDepth = void 0 !== options.maxDepth ? options.maxDepth : 8
        }
        var AABB = require("../collision/AABB")
          , Vec3 = require("../math/Vec3");
        module.exports = Octree,
        Octree.prototype = new OctreeNode,
        OctreeNode.prototype.reset = function(aabb, options) {
            this.children.length = this.data.length = 0
        }
        ,
        OctreeNode.prototype.insert = function(aabb, elementData, level) {
            var nodeData = this.data;
            if (level = level || 0,
            !this.aabb.contains(aabb))
                return !1;
            var children = this.children;
            if (level < (this.maxDepth || this.root.maxDepth)) {
                var subdivided = !1;
                children.length || (this.subdivide(),
                subdivided = !0);
                for (var i = 0; 8 !== i; i++)
                    if (children[i].insert(aabb, elementData, level + 1))
                        return !0;
                subdivided && (children.length = 0)
            }
            return nodeData.push(elementData),
            !0
        }
        ;
        var halfDiagonal = new Vec3;
        OctreeNode.prototype.subdivide = function() {
            var aabb = this.aabb
              , l = aabb.lowerBound
              , u = aabb.upperBound
              , children = this.children;
            children.push(new OctreeNode({
                aabb: new AABB({
                    lowerBound: new Vec3(0,0,0)
                })
            }), new OctreeNode({
                aabb: new AABB({
                    lowerBound: new Vec3(1,0,0)
                })
            }), new OctreeNode({
                aabb: new AABB({
                    lowerBound: new Vec3(1,1,0)
                })
            }), new OctreeNode({
                aabb: new AABB({
                    lowerBound: new Vec3(1,1,1)
                })
            }), new OctreeNode({
                aabb: new AABB({
                    lowerBound: new Vec3(0,1,1)
                })
            }), new OctreeNode({
                aabb: new AABB({
                    lowerBound: new Vec3(0,0,1)
                })
            }), new OctreeNode({
                aabb: new AABB({
                    lowerBound: new Vec3(1,0,1)
                })
            }), new OctreeNode({
                aabb: new AABB({
                    lowerBound: new Vec3(0,1,0)
                })
            })),
            u.vsub(l, halfDiagonal),
            halfDiagonal.scale(.5, halfDiagonal);
            for (var root = this.root || this, i = 0; 8 !== i; i++) {
                var child = children[i];
                child.root = root;
                var lowerBound = child.aabb.lowerBound;
                lowerBound.x *= halfDiagonal.x,
                lowerBound.y *= halfDiagonal.y,
                lowerBound.z *= halfDiagonal.z,
                lowerBound.vadd(l, lowerBound),
                lowerBound.vadd(halfDiagonal, child.aabb.upperBound)
            }
        }
        ,
        OctreeNode.prototype.aabbQuery = function(aabb, result) {
            this.data,
            this.children;
            for (var queue = [this]; queue.length; ) {
                var node = queue.pop();
                node.aabb.overlaps(aabb) && Array.prototype.push.apply(result, node.data),
                Array.prototype.push.apply(queue, node.children)
            }
            return result
        }
        ;
        var tmpAABB = new AABB;
        OctreeNode.prototype.rayQuery = function(ray, treeTransform, result) {
            return ray.getAABB(tmpAABB),
            tmpAABB.toLocalFrame(treeTransform, tmpAABB),
            this.aabbQuery(tmpAABB, result),
            result
        }
        ,
        OctreeNode.prototype.removeEmptyNodes = function() {
            for (var queue = [this]; queue.length; ) {
                for (var node = queue.pop(), i = node.children.length - 1; i >= 0; i--)
                    node.children[i].data.length || node.children.splice(i, 1);
                Array.prototype.push.apply(queue, node.children)
            }
        }
    }
    , {
        "../collision/AABB": 5,
        "../math/Vec3": 33
    }],
    54: [function(require, module, exports) {
        function Pool() {
            this.objects = [],
            this.type = Object
        }
        module.exports = Pool,
        Pool.prototype.release = function() {
            for (var Nargs = arguments.length, i = 0; i !== Nargs; i++)
                this.objects.push(arguments[i]);
            return this
        }
        ,
        Pool.prototype.get = function() {
            return 0 === this.objects.length ? this.constructObject() : this.objects.pop()
        }
        ,
        Pool.prototype.constructObject = function() {
            throw new Error("constructObject() not implemented in this Pool subclass yet!")
        }
        ,
        Pool.prototype.resize = function(size) {
            for (var objects = this.objects; objects.length > size; )
                objects.pop();
            for (; objects.length < size; )
                objects.push(this.constructObject());
            return this
        }
    }
    , {}],
    55: [function(require, module, exports) {
        function TupleDictionary() {
            this.data = {
                keys: []
            }
        }
        module.exports = TupleDictionary,
        TupleDictionary.prototype.get = function(i, j) {
            if (i > j) {
                var temp = j;
                j = i,
                i = temp
            }
            return this.data[i + "-" + j]
        }
        ,
        TupleDictionary.prototype.set = function(i, j, value) {
            if (i > j) {
                var temp = j;
                j = i,
                i = temp
            }
            var key = i + "-" + j;
            this.get(i, j) || this.data.keys.push(key),
            this.data[key] = value
        }
        ,
        TupleDictionary.prototype.reset = function() {
            for (var data = this.data, keys = data.keys; keys.length > 0; )
                delete data[keys.pop()]
        }
    }
    , {}],
    56: [function(require, module, exports) {
        function Utils() {}
        module.exports = Utils,
        Utils.defaults = function(options, defaults) {
            options = options || {};
            for (var key in defaults)
                key in options || (options[key] = defaults[key]);
            return options
        }
    }
    , {}],
    57: [function(require, module, exports) {
        function Vec3Pool() {
            Pool.call(this),
            this.type = Vec3
        }
        module.exports = Vec3Pool;
        var Vec3 = require("../math/Vec3")
          , Pool = require("./Pool");
        Vec3Pool.prototype = new Pool,
        Vec3Pool.prototype.constructObject = function() {
            return new Vec3
        }
    }
    , {
        "../math/Vec3": 33,
        "./Pool": 54
    }],
    58: [function(require, module, exports) {
        function Narrowphase(world) {
            this.contactPointPool = [],
            this.frictionEquationPool = [],
            this.result = [],
            this.frictionResult = [],
            this.v3pool = new Vec3Pool,
            this.world = world,
            this.currentContactMaterial = null,
            this.enableFrictionReduction = !1
        }
        function pointInPolygon(verts, normal, p) {
            for (var positiveResult = null, N = verts.length, i = 0; i !== N; i++) {
                var v = verts[i]
                  , edge = pointInPolygon_edge;
                verts[(i + 1) % N].vsub(v, edge);
                var edge_x_normal = pointInPolygon_edge_x_normal;
                edge.cross(normal, edge_x_normal);
                var vertex_to_p = pointInPolygon_vtp;
                p.vsub(v, vertex_to_p);
                var r = edge_x_normal.dot(vertex_to_p);
                if (!(null === positiveResult || r > 0 && !0 === positiveResult || r <= 0 && !1 === positiveResult))
                    return !1;
                null === positiveResult && (positiveResult = r > 0)
            }
            return !0
        }
        module.exports = Narrowphase;
        var AABB = require("../collision/AABB")
          , Body = require("../objects/Body")
          , Shape = require("../shapes/Shape")
          , Ray = require("../collision/Ray")
          , Vec3 = require("../math/Vec3")
          , Transform = require("../math/Transform")
          , Quaternion = (require("../shapes/ConvexPolyhedron"),
        require("../math/Quaternion"))
          , Vec3Pool = (require("../solver/Solver"),
        require("../utils/Vec3Pool"))
          , ContactEquation = require("../equations/ContactEquation")
          , FrictionEquation = require("../equations/FrictionEquation");
        Narrowphase.prototype.createContactEquation = function(bi, bj, si, sj, overrideShapeA, overrideShapeB) {
            var c;
            this.contactPointPool.length ? ((c = this.contactPointPool.pop()).bi = bi,
            c.bj = bj) : c = new ContactEquation(bi,bj),
            c.enabled = bi.collisionResponse && bj.collisionResponse && si.collisionResponse && sj.collisionResponse;
            var cm = this.currentContactMaterial;
            c.restitution = cm.restitution,
            c.setSpookParams(cm.contactEquationStiffness, cm.contactEquationRelaxation, this.world.dt);
            var matA = si.material || bi.material
              , matB = sj.material || bj.material;
            return matA && matB && matA.restitution >= 0 && matB.restitution >= 0 && (c.restitution = matA.restitution * matB.restitution),
            c.si = overrideShapeA || si,
            c.sj = overrideShapeB || sj,
            c
        }
        ,
        Narrowphase.prototype.createFrictionEquationsFromContact = function(contactEquation, outArray) {
            var bodyA = contactEquation.bi
              , bodyB = contactEquation.bj
              , shapeA = contactEquation.si
              , shapeB = contactEquation.sj
              , world = this.world
              , cm = this.currentContactMaterial
              , friction = cm.friction
              , matA = shapeA.material || bodyA.material
              , matB = shapeB.material || bodyB.material;
            if (matA && matB && matA.friction >= 0 && matB.friction >= 0 && (friction = matA.friction * matB.friction),
            friction > 0) {
                var mug = friction * world.gravity.length()
                  , reducedMass = bodyA.invMass + bodyB.invMass;
                reducedMass > 0 && (reducedMass = 1 / reducedMass);
                var pool = this.frictionEquationPool
                  , c1 = pool.length ? pool.pop() : new FrictionEquation(bodyA,bodyB,mug * reducedMass)
                  , c2 = pool.length ? pool.pop() : new FrictionEquation(bodyA,bodyB,mug * reducedMass);
                return c1.bi = c2.bi = bodyA,
                c1.bj = c2.bj = bodyB,
                c1.minForce = c2.minForce = -mug * reducedMass,
                c1.maxForce = c2.maxForce = mug * reducedMass,
                c1.ri.copy(contactEquation.ri),
                c1.rj.copy(contactEquation.rj),
                c2.ri.copy(contactEquation.ri),
                c2.rj.copy(contactEquation.rj),
                contactEquation.ni.tangents(c1.t, c2.t),
                c1.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, world.dt),
                c2.setSpookParams(cm.frictionEquationStiffness, cm.frictionEquationRelaxation, world.dt),
                c1.enabled = c2.enabled = contactEquation.enabled,
                outArray.push(c1, c2),
                !0
            }
            return !1
        }
        ;
        var averageNormal = new Vec3
          , averageContactPointA = new Vec3
          , averageContactPointB = new Vec3;
        Narrowphase.prototype.createFrictionFromAverage = function(numContacts) {
            var c = this.result[this.result.length - 1];
            if (this.createFrictionEquationsFromContact(c, this.frictionResult) && 1 !== numContacts) {
                var f1 = this.frictionResult[this.frictionResult.length - 2]
                  , f2 = this.frictionResult[this.frictionResult.length - 1];
                averageNormal.setZero(),
                averageContactPointA.setZero(),
                averageContactPointB.setZero();
                for (var bodyA = c.bi, i = (c.bj,
                0); i !== numContacts; i++)
                    (c = this.result[this.result.length - 1 - i]).bodyA !== bodyA ? (averageNormal.vadd(c.ni, averageNormal),
                    averageContactPointA.vadd(c.ri, averageContactPointA),
                    averageContactPointB.vadd(c.rj, averageContactPointB)) : (averageNormal.vsub(c.ni, averageNormal),
                    averageContactPointA.vadd(c.rj, averageContactPointA),
                    averageContactPointB.vadd(c.ri, averageContactPointB));
                var invNumContacts = 1 / numContacts;
                averageContactPointA.scale(invNumContacts, f1.ri),
                averageContactPointB.scale(invNumContacts, f1.rj),
                f2.ri.copy(f1.ri),
                f2.rj.copy(f1.rj),
                averageNormal.normalize(),
                averageNormal.tangents(f1.t, f2.t)
            }
        }
        ;
        var tmpVec1 = new Vec3
          , tmpVec2 = new Vec3
          , tmpQuat1 = new Quaternion
          , tmpQuat2 = new Quaternion;
        Narrowphase.prototype.getContacts = function(p1, p2, world, result, oldcontacts, frictionResult, frictionPool) {
            this.contactPointPool = oldcontacts,
            this.frictionEquationPool = frictionPool,
            this.result = result,
            this.frictionResult = frictionResult;
            for (var qi = tmpQuat1, qj = tmpQuat2, xi = tmpVec1, xj = tmpVec2, k = 0, N = p1.length; k !== N; k++) {
                var bi = p1[k]
                  , bj = p2[k]
                  , bodyContactMaterial = null;
                bi.material && bj.material && (bodyContactMaterial = world.getContactMaterial(bi.material, bj.material) || null);
                for (var justTest = bi.type & Body.KINEMATIC && bj.type & Body.STATIC || bi.type & Body.STATIC && bj.type & Body.KINEMATIC || bi.type & Body.KINEMATIC && bj.type & Body.KINEMATIC, i = 0; i < bi.shapes.length; i++) {
                    bi.quaternion.mult(bi.shapeOrientations[i], qi),
                    bi.quaternion.vmult(bi.shapeOffsets[i], xi),
                    xi.vadd(bi.position, xi);
                    for (var si = bi.shapes[i], j = 0; j < bj.shapes.length; j++) {
                        bj.quaternion.mult(bj.shapeOrientations[j], qj),
                        bj.quaternion.vmult(bj.shapeOffsets[j], xj),
                        xj.vadd(bj.position, xj);
                        var sj = bj.shapes[j];
                        if (!(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius)) {
                            var shapeContactMaterial = null;
                            si.material && sj.material && (shapeContactMaterial = world.getContactMaterial(si.material, sj.material) || null),
                            this.currentContactMaterial = shapeContactMaterial || bodyContactMaterial || world.defaultContactMaterial;
                            var resolver = this[si.type | sj.type];
                            if (resolver) {
                                (si.type < sj.type ? resolver.call(this, si, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest) : resolver.call(this, sj, si, xj, xi, qj, qi, bj, bi, si, sj, justTest)) && justTest && (world.shapeOverlapKeeper.set(si.id, sj.id),
                                world.bodyOverlapKeeper.set(bi.id, bj.id))
                            }
                        }
                    }
                }
            }
        }
        ;
        Narrowphase.prototype[Shape.types.BOX | Shape.types.BOX] = Narrowphase.prototype.boxBox = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            return si.convexPolyhedronRepresentation.material = si.material,
            sj.convexPolyhedronRepresentation.material = sj.material,
            si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse,
            sj.convexPolyhedronRepresentation.collisionResponse = sj.collisionResponse,
            this.convexConvex(si.convexPolyhedronRepresentation, sj.convexPolyhedronRepresentation, xi, xj, qi, qj, bi, bj, si, sj, justTest)
        }
        ,
        Narrowphase.prototype[Shape.types.BOX | Shape.types.CONVEXPOLYHEDRON] = Narrowphase.prototype.boxConvex = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            return si.convexPolyhedronRepresentation.material = si.material,
            si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse,
            this.convexConvex(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest)
        }
        ,
        Narrowphase.prototype[Shape.types.BOX | Shape.types.PARTICLE] = Narrowphase.prototype.boxParticle = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            return si.convexPolyhedronRepresentation.material = si.material,
            si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse,
            this.convexParticle(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest)
        }
        ,
        Narrowphase.prototype[Shape.types.SPHERE] = Narrowphase.prototype.sphereSphere = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            if (justTest)
                return xi.distanceSquared(xj) < Math.pow(si.radius + sj.radius, 2);
            var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
            xj.vsub(xi, r.ni),
            r.ni.normalize(),
            r.ri.copy(r.ni),
            r.rj.copy(r.ni),
            r.ri.mult(si.radius, r.ri),
            r.rj.mult(-sj.radius, r.rj),
            r.ri.vadd(xi, r.ri),
            r.ri.vsub(bi.position, r.ri),
            r.rj.vadd(xj, r.rj),
            r.rj.vsub(bj.position, r.rj),
            this.result.push(r),
            this.createFrictionEquationsFromContact(r, this.frictionResult)
        }
        ;
        var planeTrimesh_normal = new Vec3
          , planeTrimesh_relpos = new Vec3
          , planeTrimesh_projected = new Vec3;
        Narrowphase.prototype[Shape.types.PLANE | Shape.types.TRIMESH] = Narrowphase.prototype.planeTrimesh = function(planeShape, trimeshShape, planePos, trimeshPos, planeQuat, trimeshQuat, planeBody, trimeshBody, rsi, rsj, justTest) {
            var v = new Vec3
              , normal = planeTrimesh_normal;
            normal.set(0, 0, 1),
            planeQuat.vmult(normal, normal);
            for (var i = 0; i < trimeshShape.vertices.length / 3; i++) {
                trimeshShape.getVertex(i, v);
                var v2 = new Vec3;
                v2.copy(v),
                Transform.pointToWorldFrame(trimeshPos, trimeshQuat, v2, v);
                var relpos = planeTrimesh_relpos;
                if (v.vsub(planePos, relpos),
                normal.dot(relpos) <= 0) {
                    if (justTest)
                        return !0;
                    var r = this.createContactEquation(planeBody, trimeshBody, planeShape, trimeshShape, rsi, rsj);
                    r.ni.copy(normal);
                    var projected = planeTrimesh_projected;
                    normal.scale(relpos.dot(normal), projected),
                    v.vsub(projected, projected),
                    r.ri.copy(projected),
                    r.ri.vsub(planeBody.position, r.ri),
                    r.rj.copy(v),
                    r.rj.vsub(trimeshBody.position, r.rj),
                    this.result.push(r),
                    this.createFrictionEquationsFromContact(r, this.frictionResult)
                }
            }
        }
        ;
        var sphereTrimesh_normal = new Vec3
          , sphereTrimesh_relpos = new Vec3
          , sphereTrimesh_v = (new Vec3,
        new Vec3)
          , sphereTrimesh_v2 = new Vec3
          , sphereTrimesh_edgeVertexA = new Vec3
          , sphereTrimesh_edgeVertexB = new Vec3
          , sphereTrimesh_edgeVector = new Vec3
          , sphereTrimesh_edgeVectorUnit = new Vec3
          , sphereTrimesh_localSpherePos = new Vec3
          , sphereTrimesh_tmp = new Vec3
          , sphereTrimesh_va = new Vec3
          , sphereTrimesh_vb = new Vec3
          , sphereTrimesh_vc = new Vec3
          , sphereTrimesh_localSphereAABB = new AABB
          , sphereTrimesh_triangles = [];
        Narrowphase.prototype[Shape.types.SPHERE | Shape.types.TRIMESH] = Narrowphase.prototype.sphereTrimesh = function(sphereShape, trimeshShape, spherePos, trimeshPos, sphereQuat, trimeshQuat, sphereBody, trimeshBody, rsi, rsj, justTest) {
            var edgeVertexA = sphereTrimesh_edgeVertexA
              , edgeVertexB = sphereTrimesh_edgeVertexB
              , edgeVector = sphereTrimesh_edgeVector
              , edgeVectorUnit = sphereTrimesh_edgeVectorUnit
              , localSpherePos = sphereTrimesh_localSpherePos
              , tmp = sphereTrimesh_tmp
              , localSphereAABB = sphereTrimesh_localSphereAABB
              , v2 = sphereTrimesh_v2
              , relpos = sphereTrimesh_relpos
              , triangles = sphereTrimesh_triangles;
            Transform.pointToLocalFrame(trimeshPos, trimeshQuat, spherePos, localSpherePos);
            var sphereRadius = sphereShape.radius;
            localSphereAABB.lowerBound.set(localSpherePos.x - sphereRadius, localSpherePos.y - sphereRadius, localSpherePos.z - sphereRadius),
            localSphereAABB.upperBound.set(localSpherePos.x + sphereRadius, localSpherePos.y + sphereRadius, localSpherePos.z + sphereRadius),
            trimeshShape.getTrianglesInAABB(localSphereAABB, triangles);
            for (var v = sphereTrimesh_v, radiusSquared = sphereShape.radius * sphereShape.radius, i = 0; i < triangles.length; i++)
                for (j = 0; j < 3; j++)
                    if (trimeshShape.getVertex(trimeshShape.indices[3 * triangles[i] + j], v),
                    v.vsub(localSpherePos, relpos),
                    relpos.norm2() <= radiusSquared) {
                        if (v2.copy(v),
                        Transform.pointToWorldFrame(trimeshPos, trimeshQuat, v2, v),
                        v.vsub(spherePos, relpos),
                        justTest)
                            return !0;
                        (r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj)).ni.copy(relpos),
                        r.ni.normalize(),
                        r.ri.copy(r.ni),
                        r.ri.scale(sphereShape.radius, r.ri),
                        r.ri.vadd(spherePos, r.ri),
                        r.ri.vsub(sphereBody.position, r.ri),
                        r.rj.copy(v),
                        r.rj.vsub(trimeshBody.position, r.rj),
                        this.result.push(r),
                        this.createFrictionEquationsFromContact(r, this.frictionResult)
                    }
            for (i = 0; i < triangles.length; i++)
                for (var j = 0; j < 3; j++) {
                    trimeshShape.getVertex(trimeshShape.indices[3 * triangles[i] + j], edgeVertexA),
                    trimeshShape.getVertex(trimeshShape.indices[3 * triangles[i] + (j + 1) % 3], edgeVertexB),
                    edgeVertexB.vsub(edgeVertexA, edgeVector),
                    localSpherePos.vsub(edgeVertexB, tmp);
                    var positionAlongEdgeB = tmp.dot(edgeVector);
                    localSpherePos.vsub(edgeVertexA, tmp);
                    var positionAlongEdgeA = tmp.dot(edgeVector);
                    if (positionAlongEdgeA > 0 && positionAlongEdgeB < 0 && (localSpherePos.vsub(edgeVertexA, tmp),
                    edgeVectorUnit.copy(edgeVector),
                    edgeVectorUnit.normalize(),
                    positionAlongEdgeA = tmp.dot(edgeVectorUnit),
                    edgeVectorUnit.scale(positionAlongEdgeA, tmp),
                    tmp.vadd(edgeVertexA, tmp),
                    (dist = tmp.distanceTo(localSpherePos)) < sphereShape.radius)) {
                        if (justTest)
                            return !0;
                        r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj);
                        tmp.vsub(localSpherePos, r.ni),
                        r.ni.normalize(),
                        r.ni.scale(sphereShape.radius, r.ri),
                        Transform.pointToWorldFrame(trimeshPos, trimeshQuat, tmp, tmp),
                        tmp.vsub(trimeshBody.position, r.rj),
                        Transform.vectorToWorldFrame(trimeshQuat, r.ni, r.ni),
                        Transform.vectorToWorldFrame(trimeshQuat, r.ri, r.ri),
                        this.result.push(r),
                        this.createFrictionEquationsFromContact(r, this.frictionResult)
                    }
                }
            for (var va = sphereTrimesh_va, vb = sphereTrimesh_vb, vc = sphereTrimesh_vc, normal = sphereTrimesh_normal, i = 0, N = triangles.length; i !== N; i++) {
                trimeshShape.getTriangleVertices(triangles[i], va, vb, vc),
                trimeshShape.getNormal(triangles[i], normal),
                localSpherePos.vsub(va, tmp);
                var dist = tmp.dot(normal);
                if (normal.scale(dist, tmp),
                localSpherePos.vsub(tmp, tmp),
                dist = tmp.distanceTo(localSpherePos),
                Ray.pointInTriangle(tmp, va, vb, vc) && dist < sphereShape.radius) {
                    if (justTest)
                        return !0;
                    var r = this.createContactEquation(sphereBody, trimeshBody, sphereShape, trimeshShape, rsi, rsj);
                    tmp.vsub(localSpherePos, r.ni),
                    r.ni.normalize(),
                    r.ni.scale(sphereShape.radius, r.ri),
                    Transform.pointToWorldFrame(trimeshPos, trimeshQuat, tmp, tmp),
                    tmp.vsub(trimeshBody.position, r.rj),
                    Transform.vectorToWorldFrame(trimeshQuat, r.ni, r.ni),
                    Transform.vectorToWorldFrame(trimeshQuat, r.ri, r.ri),
                    this.result.push(r),
                    this.createFrictionEquationsFromContact(r, this.frictionResult)
                }
            }
            triangles.length = 0
        }
        ;
        var point_on_plane_to_sphere = new Vec3
          , plane_to_sphere_ortho = new Vec3;
        Narrowphase.prototype[Shape.types.SPHERE | Shape.types.PLANE] = Narrowphase.prototype.spherePlane = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
            if (r.ni.set(0, 0, 1),
            qj.vmult(r.ni, r.ni),
            r.ni.negate(r.ni),
            r.ni.normalize(),
            r.ni.mult(si.radius, r.ri),
            xi.vsub(xj, point_on_plane_to_sphere),
            r.ni.mult(r.ni.dot(point_on_plane_to_sphere), plane_to_sphere_ortho),
            point_on_plane_to_sphere.vsub(plane_to_sphere_ortho, r.rj),
            -point_on_plane_to_sphere.dot(r.ni) <= si.radius) {
                if (justTest)
                    return !0;
                var ri = r.ri
                  , rj = r.rj;
                ri.vadd(xi, ri),
                ri.vsub(bi.position, ri),
                rj.vadd(xj, rj),
                rj.vsub(bj.position, rj),
                this.result.push(r),
                this.createFrictionEquationsFromContact(r, this.frictionResult)
            }
        }
        ;
        var pointInPolygon_edge = new Vec3
          , pointInPolygon_edge_x_normal = new Vec3
          , pointInPolygon_vtp = new Vec3
          , box_to_sphere = new Vec3
          , sphereBox_ns = new Vec3
          , sphereBox_ns1 = new Vec3
          , sphereBox_ns2 = new Vec3
          , sphereBox_sides = [new Vec3, new Vec3, new Vec3, new Vec3, new Vec3, new Vec3]
          , sphereBox_sphere_to_corner = new Vec3
          , sphereBox_side_ns = new Vec3
          , sphereBox_side_ns1 = new Vec3
          , sphereBox_side_ns2 = new Vec3;
        Narrowphase.prototype[Shape.types.SPHERE | Shape.types.BOX] = Narrowphase.prototype.sphereBox = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            var v3pool = this.v3pool
              , sides = sphereBox_sides;
            xi.vsub(xj, box_to_sphere),
            sj.getSideNormals(sides, qj);
            for (var R = si.radius, found = !1, side_ns = sphereBox_side_ns, side_ns1 = sphereBox_side_ns1, side_ns2 = sphereBox_side_ns2, side_h = null, side_penetrations = 0, side_dot1 = 0, side_dot2 = 0, side_distance = null, idx = 0, nsides = sides.length; idx !== nsides && !1 === found; idx++) {
                var ns = sphereBox_ns;
                ns.copy(sides[idx]);
                var h = ns.norm();
                ns.normalize();
                var dot = box_to_sphere.dot(ns);
                if (dot < h + R && dot > 0) {
                    var ns1 = sphereBox_ns1
                      , ns2 = sphereBox_ns2;
                    ns1.copy(sides[(idx + 1) % 3]),
                    ns2.copy(sides[(idx + 2) % 3]);
                    var h1 = ns1.norm()
                      , h2 = ns2.norm();
                    ns1.normalize(),
                    ns2.normalize();
                    var dot1 = box_to_sphere.dot(ns1)
                      , dot2 = box_to_sphere.dot(ns2);
                    if (dot1 < h1 && dot1 > -h1 && dot2 < h2 && dot2 > -h2) {
                        dist = Math.abs(dot - h - R);
                        if ((null === side_distance || dist < side_distance) && (side_distance = dist,
                        side_dot1 = dot1,
                        side_dot2 = dot2,
                        side_h = h,
                        side_ns.copy(ns),
                        side_ns1.copy(ns1),
                        side_ns2.copy(ns2),
                        side_penetrations++,
                        justTest))
                            return !0
                    }
                }
            }
            if (side_penetrations) {
                found = !0;
                r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                side_ns.mult(-R, r.ri),
                r.ni.copy(side_ns),
                r.ni.negate(r.ni),
                side_ns.mult(side_h, side_ns),
                side_ns1.mult(side_dot1, side_ns1),
                side_ns.vadd(side_ns1, side_ns),
                side_ns2.mult(side_dot2, side_ns2),
                side_ns.vadd(side_ns2, r.rj),
                r.ri.vadd(xi, r.ri),
                r.ri.vsub(bi.position, r.ri),
                r.rj.vadd(xj, r.rj),
                r.rj.vsub(bj.position, r.rj),
                this.result.push(r),
                this.createFrictionEquationsFromContact(r, this.frictionResult)
            }
            for (var rj = v3pool.get(), sphere_to_corner = sphereBox_sphere_to_corner, j = 0; 2 !== j && !found; j++)
                for (k = 0; 2 !== k && !found; k++)
                    for (l = 0; 2 !== l && !found; l++)
                        if (rj.set(0, 0, 0),
                        j ? rj.vadd(sides[0], rj) : rj.vsub(sides[0], rj),
                        k ? rj.vadd(sides[1], rj) : rj.vsub(sides[1], rj),
                        l ? rj.vadd(sides[2], rj) : rj.vsub(sides[2], rj),
                        xj.vadd(rj, sphere_to_corner),
                        sphere_to_corner.vsub(xi, sphere_to_corner),
                        sphere_to_corner.norm2() < R * R) {
                            if (justTest)
                                return !0;
                            found = !0,
                            (r = this.createContactEquation(bi, bj, si, sj, rsi, rsj)).ri.copy(sphere_to_corner),
                            r.ri.normalize(),
                            r.ni.copy(r.ri),
                            r.ri.mult(R, r.ri),
                            r.rj.copy(rj),
                            r.ri.vadd(xi, r.ri),
                            r.ri.vsub(bi.position, r.ri),
                            r.rj.vadd(xj, r.rj),
                            r.rj.vsub(bj.position, r.rj),
                            this.result.push(r),
                            this.createFrictionEquationsFromContact(r, this.frictionResult)
                        }
            v3pool.release(rj),
            rj = null;
            for (var edgeTangent = v3pool.get(), edgeCenter = v3pool.get(), r = v3pool.get(), orthogonal = v3pool.get(), dist = v3pool.get(), Nsides = sides.length, j = 0; j !== Nsides && !found; j++)
                for (var k = 0; k !== Nsides && !found; k++)
                    if (j % 3 != k % 3) {
                        sides[k].cross(sides[j], edgeTangent),
                        edgeTangent.normalize(),
                        sides[j].vadd(sides[k], edgeCenter),
                        r.copy(xi),
                        r.vsub(edgeCenter, r),
                        r.vsub(xj, r);
                        var orthonorm = r.dot(edgeTangent);
                        edgeTangent.mult(orthonorm, orthogonal);
                        for (var l = 0; l === j % 3 || l === k % 3; )
                            l++;
                        dist.copy(xi),
                        dist.vsub(orthogonal, dist),
                        dist.vsub(edgeCenter, dist),
                        dist.vsub(xj, dist);
                        var tdist = Math.abs(orthonorm)
                          , ndist = dist.norm();
                        if (tdist < sides[l].norm() && ndist < R) {
                            if (justTest)
                                return !0;
                            found = !0;
                            var res = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                            edgeCenter.vadd(orthogonal, res.rj),
                            res.rj.copy(res.rj),
                            dist.negate(res.ni),
                            res.ni.normalize(),
                            res.ri.copy(res.rj),
                            res.ri.vadd(xj, res.ri),
                            res.ri.vsub(xi, res.ri),
                            res.ri.normalize(),
                            res.ri.mult(R, res.ri),
                            res.ri.vadd(xi, res.ri),
                            res.ri.vsub(bi.position, res.ri),
                            res.rj.vadd(xj, res.rj),
                            res.rj.vsub(bj.position, res.rj),
                            this.result.push(res),
                            this.createFrictionEquationsFromContact(res, this.frictionResult)
                        }
                    }
            v3pool.release(edgeTangent, edgeCenter, r, orthogonal, dist)
        }
        ;
        var convex_to_sphere = new Vec3
          , sphereConvex_edge = new Vec3
          , sphereConvex_edgeUnit = new Vec3
          , sphereConvex_sphereToCorner = new Vec3
          , sphereConvex_worldCorner = new Vec3
          , sphereConvex_worldNormal = new Vec3
          , sphereConvex_worldPoint = new Vec3
          , sphereConvex_worldSpherePointClosestToPlane = new Vec3
          , sphereConvex_penetrationVec = new Vec3
          , sphereConvex_sphereToWorldPoint = new Vec3;
        Narrowphase.prototype[Shape.types.SPHERE | Shape.types.CONVEXPOLYHEDRON] = Narrowphase.prototype.sphereConvex = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            var v3pool = this.v3pool;
            xi.vsub(xj, convex_to_sphere);
            for (var normals = sj.faceNormals, faces = sj.faces, verts = sj.vertices, R = si.radius, i = 0; i !== verts.length; i++) {
                var v = verts[i]
                  , worldCorner = sphereConvex_worldCorner;
                qj.vmult(v, worldCorner),
                xj.vadd(worldCorner, worldCorner);
                var sphere_to_corner = sphereConvex_sphereToCorner;
                if (worldCorner.vsub(xi, sphere_to_corner),
                sphere_to_corner.norm2() < R * R)
                    return !!justTest || (found = !0,
                    (r = this.createContactEquation(bi, bj, si, sj, rsi, rsj)).ri.copy(sphere_to_corner),
                    r.ri.normalize(),
                    r.ni.copy(r.ri),
                    r.ri.mult(R, r.ri),
                    worldCorner.vsub(xj, r.rj),
                    r.ri.vadd(xi, r.ri),
                    r.ri.vsub(bi.position, r.ri),
                    r.rj.vadd(xj, r.rj),
                    r.rj.vsub(bj.position, r.rj),
                    this.result.push(r),
                    void this.createFrictionEquationsFromContact(r, this.frictionResult))
            }
            for (var found = !1, i = 0, nfaces = faces.length; i !== nfaces && !1 === found; i++) {
                var normal = normals[i]
                  , face = faces[i]
                  , worldNormal = sphereConvex_worldNormal;
                qj.vmult(normal, worldNormal);
                var worldPoint = sphereConvex_worldPoint;
                qj.vmult(verts[face[0]], worldPoint),
                worldPoint.vadd(xj, worldPoint);
                var worldSpherePointClosestToPlane = sphereConvex_worldSpherePointClosestToPlane;
                worldNormal.mult(-R, worldSpherePointClosestToPlane),
                xi.vadd(worldSpherePointClosestToPlane, worldSpherePointClosestToPlane);
                var penetrationVec = sphereConvex_penetrationVec;
                worldSpherePointClosestToPlane.vsub(worldPoint, penetrationVec);
                var penetration = penetrationVec.dot(worldNormal)
                  , worldPointToSphere = sphereConvex_sphereToWorldPoint;
                if (xi.vsub(worldPoint, worldPointToSphere),
                penetration < 0 && worldPointToSphere.dot(worldNormal) > 0) {
                    for (var faceVerts = [], j = 0, Nverts = face.length; j !== Nverts; j++) {
                        var worldVertex = v3pool.get();
                        qj.vmult(verts[face[j]], worldVertex),
                        xj.vadd(worldVertex, worldVertex),
                        faceVerts.push(worldVertex)
                    }
                    if (pointInPolygon(faceVerts, worldNormal, xi)) {
                        if (justTest)
                            return !0;
                        found = !0;
                        r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                        worldNormal.mult(-R, r.ri),
                        worldNormal.negate(r.ni);
                        var penetrationVec2 = v3pool.get();
                        worldNormal.mult(-penetration, penetrationVec2);
                        var penetrationSpherePoint = v3pool.get();
                        worldNormal.mult(-R, penetrationSpherePoint),
                        xi.vsub(xj, r.rj),
                        r.rj.vadd(penetrationSpherePoint, r.rj),
                        r.rj.vadd(penetrationVec2, r.rj),
                        r.rj.vadd(xj, r.rj),
                        r.rj.vsub(bj.position, r.rj),
                        r.ri.vadd(xi, r.ri),
                        r.ri.vsub(bi.position, r.ri),
                        v3pool.release(penetrationVec2),
                        v3pool.release(penetrationSpherePoint),
                        this.result.push(r),
                        this.createFrictionEquationsFromContact(r, this.frictionResult);
                        for (var j = 0, Nfaceverts = faceVerts.length; j !== Nfaceverts; j++)
                            v3pool.release(faceVerts[j]);
                        return
                    }
                    for (j = 0; j !== face.length; j++) {
                        var v1 = v3pool.get()
                          , v2 = v3pool.get();
                        qj.vmult(verts[face[(j + 1) % face.length]], v1),
                        qj.vmult(verts[face[(j + 2) % face.length]], v2),
                        xj.vadd(v1, v1),
                        xj.vadd(v2, v2);
                        var edge = sphereConvex_edge;
                        v2.vsub(v1, edge);
                        var edgeUnit = sphereConvex_edgeUnit;
                        edge.unit(edgeUnit);
                        var p = v3pool.get()
                          , v1_to_xi = v3pool.get();
                        xi.vsub(v1, v1_to_xi);
                        var dot = v1_to_xi.dot(edgeUnit);
                        edgeUnit.mult(dot, p),
                        p.vadd(v1, p);
                        var xi_to_p = v3pool.get();
                        if (p.vsub(xi, xi_to_p),
                        dot > 0 && dot * dot < edge.norm2() && xi_to_p.norm2() < R * R) {
                            if (justTest)
                                return !0;
                            var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                            p.vsub(xj, r.rj),
                            p.vsub(xi, r.ni),
                            r.ni.normalize(),
                            r.ni.mult(R, r.ri),
                            r.rj.vadd(xj, r.rj),
                            r.rj.vsub(bj.position, r.rj),
                            r.ri.vadd(xi, r.ri),
                            r.ri.vsub(bi.position, r.ri),
                            this.result.push(r),
                            this.createFrictionEquationsFromContact(r, this.frictionResult);
                            for (var j = 0, Nfaceverts = faceVerts.length; j !== Nfaceverts; j++)
                                v3pool.release(faceVerts[j]);
                            return v3pool.release(v1),
                            v3pool.release(v2),
                            v3pool.release(p),
                            v3pool.release(xi_to_p),
                            void v3pool.release(v1_to_xi)
                        }
                        v3pool.release(v1),
                        v3pool.release(v2),
                        v3pool.release(p),
                        v3pool.release(xi_to_p),
                        v3pool.release(v1_to_xi)
                    }
                    for (var j = 0, Nfaceverts = faceVerts.length; j !== Nfaceverts; j++)
                        v3pool.release(faceVerts[j])
                }
            }
        }
        ;
        new Vec3,
        new Vec3;
        Narrowphase.prototype[Shape.types.PLANE | Shape.types.BOX] = Narrowphase.prototype.planeBox = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            return sj.convexPolyhedronRepresentation.material = sj.material,
            sj.convexPolyhedronRepresentation.collisionResponse = sj.collisionResponse,
            sj.convexPolyhedronRepresentation.id = sj.id,
            this.planeConvex(si, sj.convexPolyhedronRepresentation, xi, xj, qi, qj, bi, bj, si, sj, justTest)
        }
        ;
        var planeConvex_v = new Vec3
          , planeConvex_normal = new Vec3
          , planeConvex_relpos = new Vec3
          , planeConvex_projected = new Vec3;
        Narrowphase.prototype[Shape.types.PLANE | Shape.types.CONVEXPOLYHEDRON] = Narrowphase.prototype.planeConvex = function(planeShape, convexShape, planePosition, convexPosition, planeQuat, convexQuat, planeBody, convexBody, si, sj, justTest) {
            var worldVertex = planeConvex_v
              , worldNormal = planeConvex_normal;
            worldNormal.set(0, 0, 1),
            planeQuat.vmult(worldNormal, worldNormal);
            for (var numContacts = 0, relpos = planeConvex_relpos, i = 0; i !== convexShape.vertices.length; i++)
                if (worldVertex.copy(convexShape.vertices[i]),
                convexQuat.vmult(worldVertex, worldVertex),
                convexPosition.vadd(worldVertex, worldVertex),
                worldVertex.vsub(planePosition, relpos),
                worldNormal.dot(relpos) <= 0) {
                    if (justTest)
                        return !0;
                    var r = this.createContactEquation(planeBody, convexBody, planeShape, convexShape, si, sj)
                      , projected = planeConvex_projected;
                    worldNormal.mult(worldNormal.dot(relpos), projected),
                    worldVertex.vsub(projected, projected),
                    projected.vsub(planePosition, r.ri),
                    r.ni.copy(worldNormal),
                    worldVertex.vsub(convexPosition, r.rj),
                    r.ri.vadd(planePosition, r.ri),
                    r.ri.vsub(planeBody.position, r.ri),
                    r.rj.vadd(convexPosition, r.rj),
                    r.rj.vsub(convexBody.position, r.rj),
                    this.result.push(r),
                    numContacts++,
                    this.enableFrictionReduction || this.createFrictionEquationsFromContact(r, this.frictionResult)
                }
            this.enableFrictionReduction && numContacts && this.createFrictionFromAverage(numContacts)
        }
        ;
        var convexConvex_sepAxis = new Vec3
          , convexConvex_q = new Vec3;
        Narrowphase.prototype[Shape.types.CONVEXPOLYHEDRON] = Narrowphase.prototype.convexConvex = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest, faceListA, faceListB) {
            var sepAxis = convexConvex_sepAxis;
            if (!(xi.distanceTo(xj) > si.boundingSphereRadius + sj.boundingSphereRadius) && si.findSeparatingAxis(sj, xi, qi, xj, qj, sepAxis, faceListA, faceListB)) {
                var res = []
                  , q = convexConvex_q;
                si.clipAgainstHull(xi, qi, sj, xj, qj, sepAxis, -100, 100, res);
                for (var numContacts = 0, j = 0; j !== res.length; j++) {
                    if (justTest)
                        return !0;
                    var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj)
                      , ri = r.ri
                      , rj = r.rj;
                    sepAxis.negate(r.ni),
                    res[j].normal.negate(q),
                    q.mult(res[j].depth, q),
                    res[j].point.vadd(q, ri),
                    rj.copy(res[j].point),
                    ri.vsub(xi, ri),
                    rj.vsub(xj, rj),
                    ri.vadd(xi, ri),
                    ri.vsub(bi.position, ri),
                    rj.vadd(xj, rj),
                    rj.vsub(bj.position, rj),
                    this.result.push(r),
                    numContacts++,
                    this.enableFrictionReduction || this.createFrictionEquationsFromContact(r, this.frictionResult)
                }
                this.enableFrictionReduction && numContacts && this.createFrictionFromAverage(numContacts)
            }
        }
        ;
        var particlePlane_normal = new Vec3
          , particlePlane_relpos = new Vec3
          , particlePlane_projected = new Vec3;
        Narrowphase.prototype[Shape.types.PLANE | Shape.types.PARTICLE] = Narrowphase.prototype.planeParticle = function(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
            var normal = particlePlane_normal;
            normal.set(0, 0, 1),
            bj.quaternion.vmult(normal, normal);
            var relpos = particlePlane_relpos;
            if (xi.vsub(bj.position, relpos),
            normal.dot(relpos) <= 0) {
                if (justTest)
                    return !0;
                var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                r.ni.copy(normal),
                r.ni.negate(r.ni),
                r.ri.set(0, 0, 0);
                var projected = particlePlane_projected;
                normal.mult(normal.dot(xi), projected),
                xi.vsub(projected, projected),
                r.rj.copy(projected),
                this.result.push(r),
                this.createFrictionEquationsFromContact(r, this.frictionResult)
            }
        }
        ;
        var particleSphere_normal = new Vec3;
        Narrowphase.prototype[Shape.types.PARTICLE | Shape.types.SPHERE] = Narrowphase.prototype.sphereParticle = function(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
            var normal = particleSphere_normal;
            if (normal.set(0, 0, 1),
            xi.vsub(xj, normal),
            normal.norm2() <= sj.radius * sj.radius) {
                if (justTest)
                    return !0;
                var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                normal.normalize(),
                r.rj.copy(normal),
                r.rj.mult(sj.radius, r.rj),
                r.ni.copy(normal),
                r.ni.negate(r.ni),
                r.ri.set(0, 0, 0),
                this.result.push(r),
                this.createFrictionEquationsFromContact(r, this.frictionResult)
            }
        }
        ;
        var cqj = new Quaternion
          , convexParticle_local = new Vec3
          , convexParticle_penetratedFaceNormal = (new Vec3,
        new Vec3)
          , convexParticle_vertexToParticle = new Vec3
          , convexParticle_worldPenetrationVec = new Vec3;
        Narrowphase.prototype[Shape.types.PARTICLE | Shape.types.CONVEXPOLYHEDRON] = Narrowphase.prototype.convexParticle = function(sj, si, xj, xi, qj, qi, bj, bi, rsi, rsj, justTest) {
            var penetratedFaceIndex = -1
              , penetratedFaceNormal = convexParticle_penetratedFaceNormal
              , worldPenetrationVec = convexParticle_worldPenetrationVec
              , minPenetration = null
              , numDetectedFaces = 0
              , local = convexParticle_local;
            if (local.copy(xi),
            local.vsub(xj, local),
            qj.conjugate(cqj),
            cqj.vmult(local, local),
            sj.pointIsInside(local)) {
                sj.worldVerticesNeedsUpdate && sj.computeWorldVertices(xj, qj),
                sj.worldFaceNormalsNeedsUpdate && sj.computeWorldFaceNormals(qj);
                for (var i = 0, nfaces = sj.faces.length; i !== nfaces; i++) {
                    var verts = [sj.worldVertices[sj.faces[i][0]]]
                      , normal = sj.worldFaceNormals[i];
                    xi.vsub(verts[0], convexParticle_vertexToParticle);
                    var penetration = -normal.dot(convexParticle_vertexToParticle);
                    if (null === minPenetration || Math.abs(penetration) < Math.abs(minPenetration)) {
                        if (justTest)
                            return !0;
                        minPenetration = penetration,
                        penetratedFaceIndex = i,
                        penetratedFaceNormal.copy(normal),
                        numDetectedFaces++
                    }
                }
                if (-1 !== penetratedFaceIndex) {
                    var r = this.createContactEquation(bi, bj, si, sj, rsi, rsj);
                    penetratedFaceNormal.mult(minPenetration, worldPenetrationVec),
                    worldPenetrationVec.vadd(xi, worldPenetrationVec),
                    worldPenetrationVec.vsub(xj, worldPenetrationVec),
                    r.rj.copy(worldPenetrationVec),
                    penetratedFaceNormal.negate(r.ni),
                    r.ri.set(0, 0, 0);
                    var ri = r.ri
                      , rj = r.rj;
                    ri.vadd(xi, ri),
                    ri.vsub(bi.position, ri),
                    rj.vadd(xj, rj),
                    rj.vsub(bj.position, rj),
                    this.result.push(r),
                    this.createFrictionEquationsFromContact(r, this.frictionResult)
                } else
                    console.warn("Point found inside convex, but did not find penetrating face!")
            }
        }
        ,
        Narrowphase.prototype[Shape.types.BOX | Shape.types.HEIGHTFIELD] = Narrowphase.prototype.boxHeightfield = function(si, sj, xi, xj, qi, qj, bi, bj, rsi, rsj, justTest) {
            return si.convexPolyhedronRepresentation.material = si.material,
            si.convexPolyhedronRepresentation.collisionResponse = si.collisionResponse,
            this.convexHeightfield(si.convexPolyhedronRepresentation, sj, xi, xj, qi, qj, bi, bj, si, sj, justTest)
        }
        ;
        var convexHeightfield_tmp1 = new Vec3
          , convexHeightfield_tmp2 = new Vec3
          , convexHeightfield_faceList = [0];
        Narrowphase.prototype[Shape.types.CONVEXPOLYHEDRON | Shape.types.HEIGHTFIELD] = Narrowphase.prototype.convexHeightfield = function(convexShape, hfShape, convexPos, hfPos, convexQuat, hfQuat, convexBody, hfBody, rsi, rsj, justTest) {
            var data = hfShape.data
              , w = hfShape.elementSize
              , radius = convexShape.boundingSphereRadius
              , worldPillarOffset = convexHeightfield_tmp2
              , faceList = convexHeightfield_faceList
              , localConvexPos = convexHeightfield_tmp1;
            Transform.pointToLocalFrame(hfPos, hfQuat, convexPos, localConvexPos);
            var iMinX = Math.floor((localConvexPos.x - radius) / w) - 1
              , iMaxX = Math.ceil((localConvexPos.x + radius) / w) + 1
              , iMinY = Math.floor((localConvexPos.y - radius) / w) - 1
              , iMaxY = Math.ceil((localConvexPos.y + radius) / w) + 1;
            if (!(iMaxX < 0 || iMaxY < 0 || iMinX > data.length || iMinY > data[0].length)) {
                iMinX < 0 && (iMinX = 0),
                iMaxX < 0 && (iMaxX = 0),
                iMinY < 0 && (iMinY = 0),
                iMaxY < 0 && (iMaxY = 0),
                iMinX >= data.length && (iMinX = data.length - 1),
                iMaxX >= data.length && (iMaxX = data.length - 1),
                iMaxY >= data[0].length && (iMaxY = data[0].length - 1),
                iMinY >= data[0].length && (iMinY = data[0].length - 1);
                var minMax = [];
                hfShape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
                var min = minMax[0]
                  , max = minMax[1];
                if (!(localConvexPos.z - radius > max || localConvexPos.z + radius < min))
                    for (var i = iMinX; i < iMaxX; i++)
                        for (var j = iMinY; j < iMaxY; j++) {
                            var intersecting = !1;
                            if (hfShape.getConvexTrianglePillar(i, j, !1),
                            Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset),
                            convexPos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + convexShape.boundingSphereRadius && (intersecting = this.convexConvex(convexShape, hfShape.pillarConvex, convexPos, worldPillarOffset, convexQuat, hfQuat, convexBody, hfBody, null, null, justTest, faceList, null)),
                            justTest && intersecting)
                                return !0;
                            if (hfShape.getConvexTrianglePillar(i, j, !0),
                            Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset),
                            convexPos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + convexShape.boundingSphereRadius && (intersecting = this.convexConvex(convexShape, hfShape.pillarConvex, convexPos, worldPillarOffset, convexQuat, hfQuat, convexBody, hfBody, null, null, justTest, faceList, null)),
                            justTest && intersecting)
                                return !0
                        }
            }
        }
        ;
        var sphereHeightfield_tmp1 = new Vec3
          , sphereHeightfield_tmp2 = new Vec3;
        Narrowphase.prototype[Shape.types.SPHERE | Shape.types.HEIGHTFIELD] = Narrowphase.prototype.sphereHeightfield = function(sphereShape, hfShape, spherePos, hfPos, sphereQuat, hfQuat, sphereBody, hfBody, rsi, rsj, justTest) {
            var data = hfShape.data
              , radius = sphereShape.radius
              , w = hfShape.elementSize
              , worldPillarOffset = sphereHeightfield_tmp2
              , localSpherePos = sphereHeightfield_tmp1;
            Transform.pointToLocalFrame(hfPos, hfQuat, spherePos, localSpherePos);
            var iMinX = Math.floor((localSpherePos.x - radius) / w) - 1
              , iMaxX = Math.ceil((localSpherePos.x + radius) / w) + 1
              , iMinY = Math.floor((localSpherePos.y - radius) / w) - 1
              , iMaxY = Math.ceil((localSpherePos.y + radius) / w) + 1;
            if (!(iMaxX < 0 || iMaxY < 0 || iMinX > data.length || iMaxY > data[0].length)) {
                iMinX < 0 && (iMinX = 0),
                iMaxX < 0 && (iMaxX = 0),
                iMinY < 0 && (iMinY = 0),
                iMaxY < 0 && (iMaxY = 0),
                iMinX >= data.length && (iMinX = data.length - 1),
                iMaxX >= data.length && (iMaxX = data.length - 1),
                iMaxY >= data[0].length && (iMaxY = data[0].length - 1),
                iMinY >= data[0].length && (iMinY = data[0].length - 1);
                var minMax = [];
                hfShape.getRectMinMax(iMinX, iMinY, iMaxX, iMaxY, minMax);
                var min = minMax[0]
                  , max = minMax[1];
                if (!(localSpherePos.z - radius > max || localSpherePos.z + radius < min))
                    for (var result = this.result, i = iMinX; i < iMaxX; i++)
                        for (var j = iMinY; j < iMaxY; j++) {
                            var numContactsBefore = result.length
                              , intersecting = !1;
                            if (hfShape.getConvexTrianglePillar(i, j, !1),
                            Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset),
                            spherePos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + sphereShape.boundingSphereRadius && (intersecting = this.sphereConvex(sphereShape, hfShape.pillarConvex, spherePos, worldPillarOffset, sphereQuat, hfQuat, sphereBody, hfBody, sphereShape, hfShape, justTest)),
                            justTest && intersecting)
                                return !0;
                            if (hfShape.getConvexTrianglePillar(i, j, !0),
                            Transform.pointToWorldFrame(hfPos, hfQuat, hfShape.pillarOffset, worldPillarOffset),
                            spherePos.distanceTo(worldPillarOffset) < hfShape.pillarConvex.boundingSphereRadius + sphereShape.boundingSphereRadius && (intersecting = this.sphereConvex(sphereShape, hfShape.pillarConvex, spherePos, worldPillarOffset, sphereQuat, hfQuat, sphereBody, hfBody, sphereShape, hfShape, justTest)),
                            justTest && intersecting)
                                return !0;
                            if (result.length - numContactsBefore > 2)
                                return
                        }
            }
        }
    }
    , {
        "../collision/AABB": 5,
        "../collision/Ray": 12,
        "../equations/ContactEquation": 22,
        "../equations/FrictionEquation": 24,
        "../math/Quaternion": 31,
        "../math/Transform": 32,
        "../math/Vec3": 33,
        "../objects/Body": 34,
        "../shapes/ConvexPolyhedron": 41,
        "../shapes/Shape": 46,
        "../solver/Solver": 50,
        "../utils/Vec3Pool": 57
    }],
    59: [function(require, module, exports) {
        function World(options) {
            options = options || {},
            EventTarget.apply(this),
            this.dt = -1,
            this.allowSleep = !!options.allowSleep,
            this.contacts = [],
            this.frictionEquations = [],
            this.quatNormalizeSkip = void 0 !== options.quatNormalizeSkip ? options.quatNormalizeSkip : 0,
            this.quatNormalizeFast = void 0 !== options.quatNormalizeFast && options.quatNormalizeFast,
            this.time = 0,
            this.stepnumber = 0,
            this.default_dt = 1 / 60,
            this.nextId = 0,
            this.gravity = new Vec3,
            options.gravity && this.gravity.copy(options.gravity),
            this.broadphase = void 0 !== options.broadphase ? options.broadphase : new NaiveBroadphase,
            this.bodies = [],
            this.solver = void 0 !== options.solver ? options.solver : new GSSolver,
            this.constraints = [],
            this.narrowphase = new Narrowphase(this),
            this.collisionMatrix = new ArrayCollisionMatrix,
            this.collisionMatrixPrevious = new ArrayCollisionMatrix,
            this.bodyOverlapKeeper = new OverlapKeeper,
            this.shapeOverlapKeeper = new OverlapKeeper,
            this.materials = [],
            this.contactmaterials = [],
            this.contactMaterialTable = new TupleDictionary,
            this.defaultMaterial = new Material("default"),
            this.defaultContactMaterial = new ContactMaterial(this.defaultMaterial,this.defaultMaterial,{
                friction: .3,
                restitution: 0
            }),
            this.doProfiling = !1,
            this.profile = {
                solve: 0,
                makeContactConstraints: 0,
                broadphase: 0,
                integrate: 0,
                narrowphase: 0
            },
            this.accumulator = 0,
            this.subsystems = [],
            this.addBodyEvent = {
                type: "addBody",
                body: null
            },
            this.removeBodyEvent = {
                type: "removeBody",
                body: null
            },
            this.idToBodyMap = {},
            this.broadphase.setWorld(this)
        }
        module.exports = World;
        require("../shapes/Shape");
        var Vec3 = require("../math/Vec3")
          , Quaternion = require("../math/Quaternion")
          , GSSolver = require("../solver/GSSolver")
          , Narrowphase = (require("../equations/ContactEquation"),
        require("../equations/FrictionEquation"),
        require("./Narrowphase"))
          , EventTarget = require("../utils/EventTarget")
          , ArrayCollisionMatrix = require("../collision/ArrayCollisionMatrix")
          , OverlapKeeper = require("../collision/OverlapKeeper")
          , Material = require("../material/Material")
          , ContactMaterial = require("../material/ContactMaterial")
          , Body = require("../objects/Body")
          , TupleDictionary = require("../utils/TupleDictionary")
          , RaycastResult = require("../collision/RaycastResult")
          , AABB = require("../collision/AABB")
          , Ray = require("../collision/Ray")
          , NaiveBroadphase = require("../collision/NaiveBroadphase");
        World.prototype = new EventTarget;
        new AABB;
        var tmpRay = new Ray;
        if (World.prototype.getContactMaterial = function(m1, m2) {
            return this.contactMaterialTable.get(m1.id, m2.id)
        }
        ,
        World.prototype.numObjects = function() {
            return this.bodies.length
        }
        ,
        World.prototype.collisionMatrixTick = function() {
            var temp = this.collisionMatrixPrevious;
            this.collisionMatrixPrevious = this.collisionMatrix,
            this.collisionMatrix = temp,
            this.collisionMatrix.reset(),
            this.bodyOverlapKeeper.tick(),
            this.shapeOverlapKeeper.tick()
        }
        ,
        World.prototype.add = World.prototype.addBody = function(body) {
            -1 === this.bodies.indexOf(body) && (body.index = this.bodies.length,
            this.bodies.push(body),
            body.world = this,
            body.initPosition.copy(body.position),
            body.initVelocity.copy(body.velocity),
            body.timeLastSleepy = this.time,
            body instanceof Body && (body.initAngularVelocity.copy(body.angularVelocity),
            body.initQuaternion.copy(body.quaternion)),
            this.collisionMatrix.setNumObjects(this.bodies.length),
            this.addBodyEvent.body = body,
            this.idToBodyMap[body.id] = body,
            this.dispatchEvent(this.addBodyEvent))
        }
        ,
        World.prototype.addConstraint = function(c) {
            this.constraints.push(c)
        }
        ,
        World.prototype.removeConstraint = function(c) {
            var idx = this.constraints.indexOf(c);
            -1 !== idx && this.constraints.splice(idx, 1)
        }
        ,
        World.prototype.rayTest = function(from, to, result) {
            result instanceof RaycastResult ? this.raycastClosest(from, to, {
                skipBackfaces: !0
            }, result) : this.raycastAll(from, to, {
                skipBackfaces: !0
            }, result)
        }
        ,
        World.prototype.raycastAll = function(from, to, options, callback) {
            return options.mode = Ray.ALL,
            options.from = from,
            options.to = to,
            options.callback = callback,
            tmpRay.intersectWorld(this, options)
        }
        ,
        World.prototype.raycastAny = function(from, to, options, result) {
            return options.mode = Ray.ANY,
            options.from = from,
            options.to = to,
            options.result = result,
            tmpRay.intersectWorld(this, options)
        }
        ,
        World.prototype.raycastClosest = function(from, to, options, result) {
            return options.mode = Ray.CLOSEST,
            options.from = from,
            options.to = to,
            options.result = result,
            tmpRay.intersectWorld(this, options)
        }
        ,
        World.prototype.remove = function(body) {
            body.world = null;
            var n = this.bodies.length - 1
              , bodies = this.bodies
              , idx = bodies.indexOf(body);
            if (-1 !== idx) {
                bodies.splice(idx, 1);
                for (var i = 0; i !== bodies.length; i++)
                    bodies[i].index = i;
                this.collisionMatrix.setNumObjects(n),
                this.removeBodyEvent.body = body,
                delete this.idToBodyMap[body.id],
                this.dispatchEvent(this.removeBodyEvent)
            }
        }
        ,
        World.prototype.removeBody = World.prototype.remove,
        World.prototype.getBodyById = function(id) {
            return this.idToBodyMap[id]
        }
        ,
        World.prototype.getShapeById = function(id) {
            for (var bodies = this.bodies, i = 0, bl = bodies.length; i < bl; i++)
                for (var shapes = bodies[i].shapes, j = 0, sl = shapes.length; j < sl; j++) {
                    var shape = shapes[j];
                    if (shape.id === id)
                        return shape
                }
        }
        ,
        World.prototype.addMaterial = function(m) {
            this.materials.push(m)
        }
        ,
        World.prototype.addContactMaterial = function(cmat) {
            this.contactmaterials.push(cmat),
            this.contactMaterialTable.set(cmat.materials[0].id, cmat.materials[1].id, cmat)
        }
        ,
        "undefined" == typeof performance && (performance = {}),
        !performance.now) {
            var nowOffset = Date.now();
            performance.timing && performance.timing.navigationStart && (nowOffset = performance.timing.navigationStart),
            performance.now = function() {
                return Date.now() - nowOffset
            }
        }
        new Vec3;
        World.prototype.step = function(dt, timeSinceLastCalled, maxSubSteps) {
            if (maxSubSteps = maxSubSteps || 10,
            0 === (timeSinceLastCalled = timeSinceLastCalled || 0))
                this.internalStep(dt),
                this.time += dt;
            else {
                this.accumulator += timeSinceLastCalled;
                for (var substeps = 0; this.accumulator >= dt && substeps < maxSubSteps; )
                    this.internalStep(dt),
                    this.accumulator -= dt,
                    substeps++;
                for (var t = this.accumulator % dt / dt, j = 0; j !== this.bodies.length; j++) {
                    var b = this.bodies[j];
                    b.previousPosition.lerp(b.position, t, b.interpolatedPosition),
                    b.previousQuaternion.slerp(b.quaternion, t, b.interpolatedQuaternion),
                    b.previousQuaternion.normalize()
                }
                this.time += timeSinceLastCalled
            }
        }
        ;
        var World_step_postStepEvent = {
            type: "postStep"
        }
          , World_step_preStepEvent = {
            type: "preStep"
        }
          , World_step_collideEvent = {
            type: Body.COLLIDE_EVENT_NAME,
            body: null,
            contact: null
        }
          , World_step_oldContacts = []
          , World_step_frictionEquationPool = []
          , World_step_p1 = []
          , World_step_p2 = [];
        new Vec3,
        new Vec3,
        new Vec3,
        new Vec3,
        new Vec3,
        new Vec3,
        new Vec3,
        new Vec3,
        new Vec3,
        new Quaternion,
        new Quaternion,
        new Quaternion,
        new Vec3;
        World.prototype.internalStep = function(dt) {
            this.dt = dt;
            var profilingStart, contacts = this.contacts, p1 = World_step_p1, p2 = World_step_p2, N = this.numObjects(), bodies = this.bodies, solver = this.solver, gravity = this.gravity, doProfiling = this.doProfiling, profile = this.profile, DYNAMIC = Body.DYNAMIC, constraints = this.constraints, frictionEquationPool = World_step_frictionEquationPool, gx = (gravity.norm(),
            gravity.x), gy = gravity.y, gz = gravity.z, i = 0;
            for (doProfiling && (profilingStart = performance.now()),
            i = 0; i !== N; i++)
                if ((bi = bodies[i]).type === DYNAMIC) {
                    var f = bi.force
                      , m = bi.mass;
                    f.x += m * gx,
                    f.y += m * gy,
                    f.z += m * gz
                }
            for (var i = 0, Nsubsystems = this.subsystems.length; i !== Nsubsystems; i++)
                this.subsystems[i].update();
            doProfiling && (profilingStart = performance.now()),
            p1.length = 0,
            p2.length = 0,
            this.broadphase.collisionPairs(this, p1, p2),
            doProfiling && (profile.broadphase = performance.now() - profilingStart);
            Nconstraints = constraints.length;
            for (i = 0; i !== Nconstraints; i++)
                if (!(c = constraints[i]).collideConnected)
                    for (j = p1.length - 1; j >= 0; j -= 1)
                        (c.bodyA === p1[j] && c.bodyB === p2[j] || c.bodyB === p1[j] && c.bodyA === p2[j]) && (p1.splice(j, 1),
                        p2.splice(j, 1));
            this.collisionMatrixTick(),
            doProfiling && (profilingStart = performance.now());
            var oldcontacts = World_step_oldContacts
              , NoldContacts = contacts.length;
            for (i = 0; i !== NoldContacts; i++)
                oldcontacts.push(contacts[i]);
            contacts.length = 0;
            var NoldFrictionEquations = this.frictionEquations.length;
            for (i = 0; i !== NoldFrictionEquations; i++)
                frictionEquationPool.push(this.frictionEquations[i]);
            this.frictionEquations.length = 0,
            this.narrowphase.getContacts(p1, p2, this, contacts, oldcontacts, this.frictionEquations, frictionEquationPool),
            doProfiling && (profile.narrowphase = performance.now() - profilingStart),
            doProfiling && (profilingStart = performance.now());
            for (i = 0; i < this.frictionEquations.length; i++)
                solver.addEquation(this.frictionEquations[i]);
            for (var ncontacts = contacts.length, k = 0; k !== ncontacts; k++) {
                var bi = (c = contacts[k]).bi
                  , bj = c.bj
                  , si = c.si
                  , sj = c.sj;
                (bi.material && bj.material ? this.getContactMaterial(bi.material, bj.material) || this.defaultContactMaterial : this.defaultContactMaterial).friction;
                bi.material && bj.material && (bi.material.friction >= 0 && bj.material.friction >= 0 && bi.material.friction * bj.material.friction,
                bi.material.restitution >= 0 && bj.material.restitution >= 0 && (c.restitution = bi.material.restitution * bj.material.restitution)),
                solver.addEquation(c),
                bi.allowSleep && bi.type === Body.DYNAMIC && bi.sleepState === Body.SLEEPING && bj.sleepState === Body.AWAKE && bj.type !== Body.STATIC && bj.velocity.norm2() + bj.angularVelocity.norm2() >= 2 * Math.pow(bj.sleepSpeedLimit, 2) && (bi._wakeUpAfterNarrowphase = !0),
                bj.allowSleep && bj.type === Body.DYNAMIC && bj.sleepState === Body.SLEEPING && bi.sleepState === Body.AWAKE && bi.type !== Body.STATIC && bi.velocity.norm2() + bi.angularVelocity.norm2() >= 2 * Math.pow(bi.sleepSpeedLimit, 2) && (bj._wakeUpAfterNarrowphase = !0),
                this.collisionMatrix.set(bi, bj, !0),
                this.collisionMatrixPrevious.get(bi, bj) || (World_step_collideEvent.body = bj,
                World_step_collideEvent.contact = c,
                bi.dispatchEvent(World_step_collideEvent),
                World_step_collideEvent.body = bi,
                bj.dispatchEvent(World_step_collideEvent)),
                this.bodyOverlapKeeper.set(bi.id, bj.id),
                this.shapeOverlapKeeper.set(si.id, sj.id)
            }
            for (this.emitContactEvents(),
            doProfiling && (profile.makeContactConstraints = performance.now() - profilingStart,
            profilingStart = performance.now()),
            i = 0; i !== N; i++)
                (bi = bodies[i])._wakeUpAfterNarrowphase && (bi.wakeUp(),
                bi._wakeUpAfterNarrowphase = !1);
            var Nconstraints = constraints.length;
            for (i = 0; i !== Nconstraints; i++) {
                var c = constraints[i];
                c.update();
                for (var j = 0, Neq = c.equations.length; j !== Neq; j++) {
                    var eq = c.equations[j];
                    solver.addEquation(eq)
                }
            }
            solver.solve(dt, this),
            doProfiling && (profile.solve = performance.now() - profilingStart),
            solver.removeAllEquations();
            var pow = Math.pow;
            for (i = 0; i !== N; i++)
                if ((bi = bodies[i]).type & DYNAMIC) {
                    var ld = pow(1 - bi.linearDamping, dt)
                      , v = bi.velocity;
                    v.mult(ld, v);
                    var av = bi.angularVelocity;
                    if (av) {
                        var ad = pow(1 - bi.angularDamping, dt);
                        av.mult(ad, av)
                    }
                }
            for (this.dispatchEvent(World_step_preStepEvent),
            i = 0; i !== N; i++)
                (bi = bodies[i]).preStep && bi.preStep.call(bi);
            doProfiling && (profilingStart = performance.now());
            var quatNormalize = this.stepnumber % (this.quatNormalizeSkip + 1) == 0
              , quatNormalizeFast = this.quatNormalizeFast;
            for (i = 0; i !== N; i++)
                bodies[i].integrate(dt, quatNormalize, quatNormalizeFast);
            for (this.clearForces(),
            this.broadphase.dirty = !0,
            doProfiling && (profile.integrate = performance.now() - profilingStart),
            this.time += dt,
            this.stepnumber += 1,
            this.dispatchEvent(World_step_postStepEvent),
            i = 0; i !== N; i++) {
                var postStep = (bi = bodies[i]).postStep;
                postStep && postStep.call(bi)
            }
            if (this.allowSleep)
                for (i = 0; i !== N; i++)
                    bodies[i].sleepTick(this.time)
        }
        ,
        World.prototype.emitContactEvents = function() {
            var additions = []
              , removals = []
              , beginContactEvent = {
                type: "beginContact",
                bodyA: null,
                bodyB: null
            }
              , endContactEvent = {
                type: "endContact",
                bodyA: null,
                bodyB: null
            }
              , beginShapeContactEvent = {
                type: "beginShapeContact",
                bodyA: null,
                bodyB: null,
                shapeA: null,
                shapeB: null
            }
              , endShapeContactEvent = {
                type: "endShapeContact",
                bodyA: null,
                bodyB: null,
                shapeA: null,
                shapeB: null
            };
            return function() {
                var hasBeginContact = this.hasAnyEventListener("beginContact")
                  , hasEndContact = this.hasAnyEventListener("endContact");
                if ((hasBeginContact || hasEndContact) && this.bodyOverlapKeeper.getDiff(additions, removals),
                hasBeginContact) {
                    for (var i = 0, l = additions.length; i < l; i += 2)
                        beginContactEvent.bodyA = this.getBodyById(additions[i]),
                        beginContactEvent.bodyB = this.getBodyById(additions[i + 1]),
                        this.dispatchEvent(beginContactEvent);
                    beginContactEvent.bodyA = beginContactEvent.bodyB = null
                }
                if (hasEndContact) {
                    for (var i = 0, l = removals.length; i < l; i += 2)
                        endContactEvent.bodyA = this.getBodyById(removals[i]),
                        endContactEvent.bodyB = this.getBodyById(removals[i + 1]),
                        this.dispatchEvent(endContactEvent);
                    endContactEvent.bodyA = endContactEvent.bodyB = null
                }
                additions.length = removals.length = 0;
                var hasBeginShapeContact = this.hasAnyEventListener("beginShapeContact")
                  , hasEndShapeContact = this.hasAnyEventListener("endShapeContact");
                if ((hasBeginShapeContact || hasEndShapeContact) && this.shapeOverlapKeeper.getDiff(additions, removals),
                hasBeginShapeContact) {
                    for (var i = 0, l = additions.length; i < l; i += 2) {
                        var shapeA = this.getShapeById(additions[i])
                          , shapeB = this.getShapeById(additions[i + 1]);
                        beginShapeContactEvent.shapeA = shapeA,
                        beginShapeContactEvent.shapeB = shapeB,
                        beginShapeContactEvent.bodyA = shapeA.body,
                        beginShapeContactEvent.bodyB = shapeB.body,
                        this.dispatchEvent(beginShapeContactEvent)
                    }
                    beginShapeContactEvent.bodyA = beginShapeContactEvent.bodyB = beginShapeContactEvent.shapeA = beginShapeContactEvent.shapeB = null
                }
                if (hasEndShapeContact) {
                    for (var i = 0, l = removals.length; i < l; i += 2) {
                        var shapeA = this.getShapeById(removals[i])
                          , shapeB = this.getShapeById(removals[i + 1]);
                        endShapeContactEvent.shapeA = shapeA,
                        endShapeContactEvent.shapeB = shapeB,
                        endShapeContactEvent.bodyA = shapeA.body,
                        endShapeContactEvent.bodyB = shapeB.body,
                        this.dispatchEvent(endShapeContactEvent)
                    }
                    endShapeContactEvent.bodyA = endShapeContactEvent.bodyB = endShapeContactEvent.shapeA = endShapeContactEvent.shapeB = null
                }
            }
        }(),
        World.prototype.clearForces = function() {
            for (var bodies = this.bodies, N = bodies.length, i = 0; i !== N; i++) {
                var b = bodies[i];
                b.force,
                b.torque;
                b.force.set(0, 0, 0),
                b.torque.set(0, 0, 0)
            }
        }
    }
    , {
        "../collision/AABB": 5,
        "../collision/ArrayCollisionMatrix": 6,
        "../collision/NaiveBroadphase": 9,
        "../collision/OverlapKeeper": 11,
        "../collision/Ray": 12,
        "../collision/RaycastResult": 13,
        "../equations/ContactEquation": 22,
        "../equations/FrictionEquation": 24,
        "../material/ContactMaterial": 27,
        "../material/Material": 28,
        "../math/Quaternion": 31,
        "../math/Vec3": 33,
        "../objects/Body": 34,
        "../shapes/Shape": 46,
        "../solver/GSSolver": 49,
        "../utils/EventTarget": 52,
        "../utils/TupleDictionary": 55,
        "./Narrowphase": 58
    }],
    60: [function(require, module, exports) {
        function createBoxShape(geometry) {
            if (!getVertices(geometry).length)
                return null;
            geometry.computeBoundingBox();
            var box = geometry.boundingBox;
            return new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2,(box.max.y - box.min.y) / 2,(box.max.z - box.min.z) / 2))
        }
        function createBoundingBoxShape(object) {
            var shape, localPosition, worldPosition, box = new THREE.Box3;
            return box.setFromObject(object),
            isFinite(box.min.lengthSq()) ? (shape = new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2,(box.max.y - box.min.y) / 2,(box.max.z - box.min.z) / 2)),
            object.updateMatrixWorld(),
            (worldPosition = new THREE.Vector3).setFromMatrixPosition(object.matrixWorld),
            (localPosition = box.translate(worldPosition.negate()).getCenter()).lengthSq() && (shape.offset = localPosition),
            shape) : null
        }
        function createConvexPolyhedron(object) {
            var i, vertices, faces, hull, geometry = getGeometry(object);
            if (!geometry || !geometry.vertices.length)
                return null;
            for (i = 0; i < geometry.vertices.length; i++)
                geometry.vertices[i].x += 1e-4 * (Math.random() - .5),
                geometry.vertices[i].y += 1e-4 * (Math.random() - .5),
                geometry.vertices[i].z += 1e-4 * (Math.random() - .5);
            for (hull = quickhull(geometry),
            vertices = new Array(hull.vertices.length),
            i = 0; i < hull.vertices.length; i++)
                vertices[i] = new CANNON.Vec3(hull.vertices[i].x,hull.vertices[i].y,hull.vertices[i].z);
            for (faces = new Array(hull.faces.length),
            i = 0; i < hull.faces.length; i++)
                faces[i] = [hull.faces[i].a, hull.faces[i].b, hull.faces[i].c];
            return new CANNON.ConvexPolyhedron(vertices,faces)
        }
        function createCylinderShape(geometry) {
            var shape, params = geometry.metadata ? geometry.metadata.parameters : geometry.parameters;
            return shape = new CANNON.Cylinder(params.radiusTop,params.radiusBottom,params.height,params.radialSegments),
            shape._type = CANNON.Shape.types.CYLINDER,
            shape.radiusTop = params.radiusTop,
            shape.radiusBottom = params.radiusBottom,
            shape.height = params.height,
            shape.numSegments = params.radialSegments,
            shape.orientation = new CANNON.Quaternion,
            shape.orientation.setFromEuler(THREE.Math.degToRad(90), 0, 0, "XYZ").normalize(),
            shape
        }
        function createBoundingCylinderShape(object, options) {
            var shape, height, radius, box = new THREE.Box3, axes = ["x", "y", "z"], majorAxis = options.cylinderAxis || "y", minorAxes = axes.splice(axes.indexOf(majorAxis), 1) && axes;
            return box.setFromObject(object),
            isFinite(box.min.lengthSq()) ? (height = box.max[majorAxis] - box.min[majorAxis],
            radius = .5 * Math.max(box.max[minorAxes[0]] - box.min[minorAxes[0]], box.max[minorAxes[1]] - box.min[minorAxes[1]]),
            shape = new CANNON.Cylinder(radius,radius,height,12),
            shape._type = CANNON.Shape.types.CYLINDER,
            shape.radiusTop = radius,
            shape.radiusBottom = radius,
            shape.height = height,
            shape.numSegments = 12,
            shape.orientation = new CANNON.Quaternion,
            shape.orientation.setFromEuler("y" === majorAxis ? PI_2 : 0, "z" === majorAxis ? PI_2 : 0, 0, "XYZ").normalize(),
            shape) : null
        }
        function createPlaneShape(geometry) {
            geometry.computeBoundingBox();
            var box = geometry.boundingBox;
            return new CANNON.Box(new CANNON.Vec3((box.max.x - box.min.x) / 2 || .1,(box.max.y - box.min.y) / 2 || .1,(box.max.z - box.min.z) / 2 || .1))
        }
        function createSphereShape(geometry) {
            var params = geometry.metadata ? geometry.metadata.parameters : geometry.parameters;
            return new CANNON.Sphere(params.radius)
        }
        function createBoundingSphereShape(object, options) {
            if (options.sphereRadius)
                return new CANNON.Sphere(options.sphereRadius);
            var geometry = getGeometry(object);
            return geometry ? (geometry.computeBoundingSphere(),
            new CANNON.Sphere(geometry.boundingSphere.radius)) : null
        }
        function createTrimeshShape(geometry) {
            var indices, vertices = getVertices(geometry);
            return vertices.length ? (indices = Object.keys(vertices).map(Number),
            new CANNON.Trimesh(vertices,indices)) : null
        }
        function getGeometry(object) {
            var matrix, mesh, meshes = getMeshes(object), tmp = new THREE.Geometry, combined = new THREE.Geometry;
            if (0 === meshes.length)
                return null;
            if (1 === meshes.length) {
                var position = new THREE.Vector3
                  , quaternion = new THREE.Quaternion
                  , scale = new THREE.Vector3;
                return meshes[0].geometry.isBufferGeometry ? meshes[0].geometry.attributes.position && meshes[0].geometry.attributes.position.itemSize > 2 && tmp.fromBufferGeometry(meshes[0].geometry) : tmp = meshes[0].geometry.clone(),
                tmp.metadata = meshes[0].geometry.metadata,
                meshes[0].updateMatrixWorld(),
                meshes[0].matrixWorld.decompose(position, quaternion, scale),
                tmp.scale(scale.x, scale.y, scale.z)
            }
            for (; mesh = meshes.pop(); )
                if (mesh.updateMatrixWorld(),
                mesh.geometry.isBufferGeometry) {
                    if (mesh.geometry.attributes.position && mesh.geometry.attributes.position.itemSize > 2) {
                        var tmpGeom = new THREE.Geometry;
                        tmpGeom.fromBufferGeometry(mesh.geometry),
                        combined.merge(tmpGeom, mesh.matrixWorld),
                        tmpGeom.dispose()
                    }
                } else
                    combined.merge(mesh.geometry, mesh.matrixWorld);
            return (matrix = new THREE.Matrix4).scale(object.scale),
            combined.applyMatrix(matrix),
            combined
        }
        function getVertices(geometry) {
            return geometry.attributes || (geometry = (new THREE.BufferGeometry).fromGeometry(geometry)),
            (geometry.attributes.position || {}).array || []
        }
        function getMeshes(object) {
            var meshes = [];
            return object.traverse(function(o) {
                "Mesh" === o.type && meshes.push(o)
            }),
            meshes
        }
        var CANNON = require("cannon")
          , quickhull = require("./lib/THREE.quickhull")
          , PI_2 = Math.PI / 2
          , Type = {
            BOX: "Box",
            CYLINDER: "Cylinder",
            SPHERE: "Sphere",
            HULL: "ConvexPolyhedron",
            MESH: "Trimesh"
        }
          , mesh2shape = function(object, options) {
            var geometry;
            if ((options = options || {}).type === Type.BOX)
                return createBoundingBoxShape(object);
            if (options.type === Type.CYLINDER)
                return createBoundingCylinderShape(object, options);
            if (options.type === Type.SPHERE)
                return createBoundingSphereShape(object, options);
            if (options.type === Type.HULL)
                return createConvexPolyhedron(object);
            if (options.type === Type.MESH)
                return geometry = getGeometry(object),
                geometry ? createTrimeshShape(geometry) : null;
            if (options.type)
                throw new Error('[CANNON.mesh2shape] Invalid type "%s".',options.type);
            if (!(geometry = getGeometry(object)))
                return null;
            switch (geometry.metadata ? geometry.metadata.type : geometry.type) {
            case "BoxGeometry":
            case "BoxBufferGeometry":
                return createBoxShape(geometry);
            case "CylinderGeometry":
            case "CylinderBufferGeometry":
                return createCylinderShape(geometry);
            case "PlaneGeometry":
            case "PlaneBufferGeometry":
                return createPlaneShape(geometry);
            case "SphereGeometry":
            case "SphereBufferGeometry":
                return createSphereShape(geometry);
            case "TubeGeometry":
            case "Geometry":
            case "BufferGeometry":
                return createBoundingBoxShape(object);
            default:
                return console.warn('Unrecognized geometry: "%s". Using bounding box as shape.', geometry.type),
                createBoxShape(geometry)
            }
        };
        mesh2shape.Type = Type,
        module.exports = CANNON.mesh2shape = mesh2shape
    }
    , {
        "./lib/THREE.quickhull": 61,
        cannon: 4
    }],
    61: [function(require, module, exports) {
        module.exports = function() {
            function reset() {
                ab = new THREE.Vector3,
                ac = new THREE.Vector3,
                ax = new THREE.Vector3,
                suba = new THREE.Vector3,
                subb = new THREE.Vector3,
                normal = new THREE.Vector3,
                diff = new THREE.Vector3,
                subaA = new THREE.Vector3,
                subaB = new THREE.Vector3,
                subC = new THREE.Vector3
            }
            function process(points) {
                for (; faceStack.length > 0; )
                    cull(faceStack.shift(), points)
            }
            function getNormal(face, points) {
                if (void 0 !== face.normal)
                    return face.normal;
                var p0 = points[face[0]]
                  , p1 = points[face[1]]
                  , p2 = points[face[2]];
                return ab.subVectors(p1, p0),
                ac.subVectors(p2, p0),
                normal.crossVectors(ac, ab),
                normal.normalize(),
                face.normal = normal.clone()
            }
            function assignPoints(face, pointset, points) {
                var p0 = points[face[0]]
                  , dots = []
                  , norm = getNormal(face, points);
                pointset.sort(function(aItem, bItem) {
                    return dots[aItem.x / 3] = void 0 !== dots[aItem.x / 3] ? dots[aItem.x / 3] : norm.dot(suba.subVectors(aItem, p0)),
                    dots[bItem.x / 3] = void 0 !== dots[bItem.x / 3] ? dots[bItem.x / 3] : norm.dot(subb.subVectors(bItem, p0)),
                    dots[aItem.x / 3] - dots[bItem.x / 3]
                });
                var index = pointset.length;
                for (1 === index && (dots[pointset[0].x / 3] = norm.dot(suba.subVectors(pointset[0], p0))); index-- > 0 && dots[pointset[index].x / 3] > 0; )
                    ;
                index + 1 < pointset.length && dots[pointset[index + 1].x / 3] > 0 && (face.visiblePoints = pointset.splice(index + 1))
            }
            function cull(face, points) {
                for (var currentFace, i = faces.length, visibleFaces = [face], apex = points.indexOf(face.visiblePoints.pop()); i-- > 0; )
                    (currentFace = faces[i]) !== face && getNormal(currentFace, points).dot(diff.subVectors(points[apex], points[currentFace[0]])) > 0 && visibleFaces.push(currentFace);
                var compareFace, nextIndex, a, b, j = i = visibleFaces.length, hasOneVisibleFace = 1 === i, perimeter = [], edgeIndex = 0, allPoints = [];
                visibleFaces[0][0],
                visibleFaces[0][1],
                visibleFaces[0][1],
                visibleFaces[0][2],
                visibleFaces[0][2],
                visibleFaces[0][0];
                if (1 === visibleFaces.length)
                    perimeter = [(currentFace = visibleFaces[0])[0], currentFace[1], currentFace[1], currentFace[2], currentFace[2], currentFace[0]],
                    faceStack.indexOf(currentFace) > -1 && faceStack.splice(faceStack.indexOf(currentFace), 1),
                    currentFace.visiblePoints && (allPoints = allPoints.concat(currentFace.visiblePoints)),
                    faces.splice(faces.indexOf(currentFace), 1);
                else
                    for (; i-- > 0; ) {
                        currentFace = visibleFaces[i],
                        faceStack.indexOf(currentFace) > -1 && faceStack.splice(faceStack.indexOf(currentFace), 1),
                        currentFace.visiblePoints && (allPoints = allPoints.concat(currentFace.visiblePoints)),
                        faces.splice(faces.indexOf(currentFace), 1);
                        var isSharedEdge;
                        for (cEdgeIndex = 0; cEdgeIndex < 3; ) {
                            for (isSharedEdge = !1,
                            j = visibleFaces.length,
                            a = currentFace[cEdgeIndex],
                            b = currentFace[(cEdgeIndex + 1) % 3]; j-- > 0 && !isSharedEdge; )
                                if (compareFace = visibleFaces[j],
                                edgeIndex = 0,
                                compareFace !== currentFace)
                                    for (; edgeIndex < 3 && !isSharedEdge; )
                                        nextIndex = edgeIndex + 1,
                                        isSharedEdge = compareFace[edgeIndex] === a && compareFace[nextIndex % 3] === b || compareFace[edgeIndex] === b && compareFace[nextIndex % 3] === a,
                                        edgeIndex++;
                            isSharedEdge && !hasOneVisibleFace || (perimeter.push(a),
                            perimeter.push(b)),
                            cEdgeIndex++
                        }
                    }
                i = 0;
                for (var f, l = perimeter.length / 2; i < l; )
                    assignPoints(f = [perimeter[2 * i + 1], apex, perimeter[2 * i]], allPoints, points),
                    faces.push(f),
                    void 0 !== f.visiblePoints && faceStack.push(f),
                    i++
            }
            var NUM_POINTS, extremes, dcur, j, v0, v1, v2, v3, N, D, ab, ac, ax, suba, subb, normal, diff, subaA, subaB, subC, faces = [], faceStack = [], max = 0, norm = function() {
                var ca = new THREE.Vector3
                  , ba = new THREE.Vector3
                  , N = new THREE.Vector3;
                return function(a, b, c) {
                    return ca.subVectors(c, a),
                    ba.subVectors(b, a),
                    N.crossVectors(ca, ba),
                    N.normalize()
                }
            }(), distSqPointSegment = function() {
                var ab = new THREE.Vector3
                  , ac = new THREE.Vector3
                  , bc = new THREE.Vector3;
                return function(a, b, c) {
                    ab.subVectors(b, a),
                    ac.subVectors(c, a),
                    bc.subVectors(c, b);
                    var e = ac.dot(ab);
                    if (e < 0)
                        return ac.dot(ac);
                    var f = ab.dot(ab);
                    return e >= f ? bc.dot(bc) : ac.dot(ac) - e * e / f
                }
            }();
            return function(geometry) {
                for (reset(),
                points = geometry.vertices,
                faces = [],
                faceStack = [],
                i = NUM_POINTS = points.length,
                extremes = points.slice(0, 6),
                max = 0; i-- > 0; )
                    points[i].x < extremes[0].x && (extremes[0] = points[i]),
                    points[i].x > extremes[1].x && (extremes[1] = points[i]),
                    points[i].y < extremes[2].y && (extremes[2] = points[i]),
                    points[i].y < extremes[3].y && (extremes[3] = points[i]),
                    points[i].z < extremes[4].z && (extremes[4] = points[i]),
                    points[i].z < extremes[5].z && (extremes[5] = points[i]);
                for (j = i = 6; i-- > 0; )
                    for (j = i - 1; j-- > 0; )
                        max < (dcur = extremes[i].distanceToSquared(extremes[j])) && (max = dcur,
                        v0 = extremes[i],
                        v1 = extremes[j]);
                for (i = 6,
                max = 0; i-- > 0; )
                    dcur = distSqPointSegment(v0, v1, extremes[i]),
                    max < dcur && (max = dcur,
                    v2 = extremes[i]);
                for (N = norm(v0, v1, v2),
                D = N.dot(v0),
                max = 0,
                i = NUM_POINTS; i-- > 0; )
                    dcur = Math.abs(points[i].dot(N) - D),
                    max < dcur && (max = dcur,
                    v3 = points[i]);
                var v0Index = points.indexOf(v0)
                  , v1Index = points.indexOf(v1)
                  , v2Index = points.indexOf(v2)
                  , v3Index = points.indexOf(v3)
                  , tetrahedron = [[v2Index, v1Index, v0Index], [v1Index, v3Index, v0Index], [v2Index, v3Index, v1Index], [v0Index, v3Index, v2Index]];
                subaA.subVectors(v1, v0).normalize(),
                subaB.subVectors(v2, v0).normalize(),
                subC.subVectors(v3, v0).normalize(),
                subC.dot((new THREE.Vector3).crossVectors(subaB, subaA)) < 0 && (tetrahedron[0].reverse(),
                tetrahedron[1].reverse(),
                tetrahedron[2].reverse(),
                tetrahedron[3].reverse());
                var pointsCloned = points.slice();
                pointsCloned.splice(pointsCloned.indexOf(v0), 1),
                pointsCloned.splice(pointsCloned.indexOf(v1), 1),
                pointsCloned.splice(pointsCloned.indexOf(v2), 1),
                pointsCloned.splice(pointsCloned.indexOf(v3), 1);
                for (var i = tetrahedron.length; i-- > 0; )
                    assignPoints(tetrahedron[i], pointsCloned, points),
                    void 0 !== tetrahedron[i].visiblePoints && faceStack.push(tetrahedron[i]),
                    faces.push(tetrahedron[i]);
                process(points);
                for (var ll = faces.length; ll-- > 0; )
                    geometry.faces[ll] = new THREE.Face3(faces[ll][2],faces[ll][1],faces[ll][0],faces[ll].normal);
                return geometry.normalsNeedUpdate = !0,
                geometry
            }
        }()
    }
    , {}],
    62: [function(require, module, exports) {
        var bundleFn = arguments[3]
          , sources = arguments[4]
          , cache = arguments[5]
          , stringify = JSON.stringify;
        module.exports = function(fn, options) {
            function resolveSources(key) {
                workerSources[key] = !0;
                for (var depPath in sources[key][1]) {
                    var depKey = sources[key][1][depPath];
                    workerSources[depKey] || resolveSources(depKey)
                }
            }
            for (var wkey, cacheKeys = Object.keys(cache), i = 0, l = cacheKeys.length; i < l; i++) {
                var key = cacheKeys[i]
                  , exp = cache[key].exports;
                if (exp === fn || exp && exp.default === fn) {
                    wkey = key;
                    break
                }
            }
            if (!wkey) {
                wkey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16);
                for (var wcache = {}, i = 0, l = cacheKeys.length; i < l; i++)
                    wcache[key = cacheKeys[i]] = key;
                sources[wkey] = [Function(["require", "module", "exports"], "(" + fn + ")(self)"), wcache]
            }
            var skey = Math.floor(Math.pow(16, 8) * Math.random()).toString(16)
              , scache = {};
            scache[wkey] = wkey,
            sources[skey] = [Function(["require"], "var f = require(" + stringify(wkey) + ");(f.default ? f.default : f)(self);"), scache];
            var workerSources = {};
            resolveSources(skey);
            var src = "(" + bundleFn + ")({" + Object.keys(workerSources).map(function(key) {
                return stringify(key) + ":[" + sources[key][0] + "," + stringify(sources[key][1]) + "]"
            }).join(",") + "},{},[" + stringify(skey) + "])"
              , URL = window.URL || window.webkitURL || window.mozURL || window.msURL
              , blob = new Blob([src],{
                type: "text/javascript"
            });
            if (options && options.bare)
                return blob;
            var workerUrl = URL.createObjectURL(blob)
              , worker = new Worker(workerUrl);
            return worker.objectURL = workerUrl,
            worker
        }
    }
    , {}],
    63: [function(require, module, exports) {
        var CANNON = require("cannon")
          , mesh2shape = require("three-to-cannon");
        require("../../../lib/CANNON-shape2mesh");
        var Body = {
            dependencies: ["velocity"],
            schema: {
                mass: {
                    default: 5,
                    if: {
                        type: "dynamic"
                    }
                },
                linearDamping: {
                    default: .01,
                    if: {
                        type: "dynamic"
                    }
                },
                angularDamping: {
                    default: .01,
                    if: {
                        type: "dynamic"
                    }
                },
                shape: {
                    default: "auto",
                    oneOf: ["auto", "box", "cylinder", "sphere", "hull", "mesh", "none"]
                },
                cylinderAxis: {
                    default: "y",
                    oneOf: ["x", "y", "z"]
                },
                sphereRadius: {
                    default: NaN
                },
                type: {
                    default: "dynamic",
                    oneOf: ["static", "dynamic"]
                }
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics,
                this.el.sceneEl.hasLoaded ? this.initBody() : this.el.sceneEl.addEventListener("loaded", this.initBody.bind(this))
            },
            initBody: function() {
                var el = this.el
                  , data = this.data
                  , obj = this.el.object3D
                  , pos = obj.position
                  , quat = obj.quaternion;
                if (this.body = new CANNON.Body({
                    mass: "static" === data.type ? 0 : data.mass || 0,
                    material: this.system.getMaterial("defaultMaterial"),
                    position: new CANNON.Vec3(pos.x,pos.y,pos.z),
                    quaternion: new CANNON.Quaternion(quat.x,quat.y,quat.z,quat.w),
                    linearDamping: data.linearDamping,
                    angularDamping: data.angularDamping,
                    type: "dynamic" === data.type ? CANNON.Body.DYNAMIC : CANNON.Body.STATIC
                }),
                this.el.object3D.updateMatrixWorld(!0),
                "none" !== data.shape) {
                    var options = "auto" === data.shape ? void 0 : AFRAME.utils.extend({}, this.data, {
                        type: mesh2shape.Type[data.shape.toUpperCase()]
                    })
                      , shape = mesh2shape(this.el.object3D, options);
                    if (!shape)
                        return void el.addEventListener("object3dset", this.initBody.bind(this));
                    this.body.addShape(shape, shape.offset, shape.orientation),
                    this.system.debug && (this.shouldUpdateWireframe = !0),
                    this.isLoaded = !0
                }
                this.el.body = this.body,
                this.body.el = el,
                this.isPlaying && this._play(),
                this.isLoaded && this.el.emit("body-loaded", {
                    body: this.el.body
                })
            },
            addShape: function(shape, offset, orientation) {
                "none" === this.data.shape ? shape ? (this.body.addShape(shape, offset, orientation),
                this.system.debug && (this.shouldUpdateWireframe = !0),
                this.shouldUpdateBody = !0) : console.warn("shape cannot be null") : console.warn("shape can only be added if shape property is none")
            },
            tick: function() {
                this.shouldUpdateBody && (this.isLoaded = !0,
                this._play(),
                this.el.emit("body-loaded", {
                    body: this.el.body
                }),
                this.shouldUpdateBody = !1),
                this.shouldUpdateWireframe && (this.createWireframe(this.body),
                this.shouldUpdateWireframe = !1)
            },
            play: function() {
                this.isLoaded && this._play()
            },
            _play: function() {
                this.syncToPhysics(),
                this.system.addComponent(this),
                this.system.addBody(this.body),
                this.wireframe && this.el.sceneEl.object3D.add(this.wireframe)
            },
            pause: function() {
                this.isLoaded && this._pause()
            },
            _pause: function() {
                this.system.removeComponent(this),
                this.body && this.system.removeBody(this.body),
                this.wireframe && this.el.sceneEl.object3D.remove(this.wireframe)
            },
            update: function(prevData) {
                if (this.body) {
                    var data = this.data;
                    void 0 != prevData.type && data.type !== prevData.type && console.warn("CANNON.Body type cannot be changed after instantiation"),
                    this.body.mass = data.mass || 0,
                    "dynamic" === data.type && (this.body.linearDamping = data.linearDamping,
                    this.body.angularDamping = data.angularDamping),
                    data.mass !== prevData.mass && this.body.updateMassProperties(),
                    this.body.updateProperties && this.body.updateProperties()
                }
            },
            remove: function() {
                delete this.body.el,
                delete this.body,
                delete this.el.body,
                delete this.wireframe
            },
            beforeStep: function() {
                0 === this.body.mass && this.syncToPhysics()
            },
            step: function() {
                0 !== this.body.mass && this.syncFromPhysics()
            },
            createWireframe: function(body) {
                this.wireframe && (this.el.sceneEl.object3D.remove(this.wireframe),
                delete this.wireframe),
                this.wireframe = new THREE.Object3D,
                this.el.sceneEl.object3D.add(this.wireframe);
                for (var offset, mesh, orientation = new THREE.Quaternion, i = 0; i < this.body.shapes.length; i++) {
                    offset = this.body.shapeOffsets[i],
                    orientation.copy(this.body.shapeOrientations[i]),
                    mesh = CANNON.shape2mesh(this.body).children[i];
                    var wireframe = new THREE.LineSegments(new THREE.EdgesGeometry(mesh.geometry),new THREE.LineBasicMaterial({
                        color: 16711680
                    }));
                    offset && wireframe.position.copy(offset),
                    orientation && (orientation.inverse(orientation),
                    wireframe.quaternion.copy(orientation)),
                    this.wireframe.add(wireframe)
                }
                this.syncWireframe()
            },
            syncWireframe: function() {
                var offset, wireframe = this.wireframe;
                this.wireframe && (wireframe.quaternion.copy(this.body.quaternion),
                wireframe.orientation && wireframe.quaternion.multiply(wireframe.orientation),
                wireframe.position.copy(this.body.position),
                wireframe.offset && (offset = wireframe.offset.clone().applyQuaternion(wireframe.quaternion),
                wireframe.position.add(offset)),
                wireframe.updateMatrix())
            },
            syncToPhysics: function() {
                var q = new THREE.Quaternion
                  , v = new THREE.Vector3;
                return function() {
                    var el = this.el
                      , parentEl = el.parentEl
                      , body = this.body;
                    body && (el.components.velocity && body.velocity.copy(el.getAttribute("velocity")),
                    parentEl.isScene ? (body.quaternion.copy(el.object3D.quaternion),
                    body.position.copy(el.object3D.position)) : (el.object3D.getWorldQuaternion(q),
                    body.quaternion.copy(q),
                    el.object3D.getWorldPosition(v),
                    body.position.copy(v)),
                    this.body.updateProperties && this.body.updateProperties(),
                    this.wireframe && this.syncWireframe())
                }
            }(),
            syncFromPhysics: function() {
                var v = new THREE.Vector3
                  , q1 = new THREE.Quaternion
                  , q2 = new THREE.Quaternion;
                return function() {
                    var el = this.el
                      , parentEl = el.parentEl
                      , body = this.body;
                    body && (parentEl.isScene ? (el.object3D.quaternion.copy(body.quaternion),
                    el.object3D.position.copy(body.position)) : (q1.copy(body.quaternion),
                    parentEl.object3D.getWorldQuaternion(q2),
                    q1.multiply(q2.inverse()),
                    el.object3D.quaternion.copy(q1),
                    v.copy(body.position),
                    parentEl.object3D.worldToLocal(v),
                    el.object3D.position.copy(v)),
                    this.wireframe && this.syncWireframe())
                }
            }()
        };
        module.exports.definition = Body,
        module.exports.Component = AFRAME.registerComponent("body", Body)
    }
    , {
        "../../../lib/CANNON-shape2mesh": 2,
        cannon: 4,
        "three-to-cannon": 60
    }],
    64: [function(require, module, exports) {
        var Body = require("./body")
          , DynamicBody = AFRAME.utils.extend({}, Body.definition);
        module.exports = AFRAME.registerComponent("dynamic-body", DynamicBody)
    }
    , {
        "./body": 63
    }],
    65: [function(require, module, exports) {
        var Body = require("./body")
          , StaticBody = AFRAME.utils.extend({}, Body.definition);
        StaticBody.schema = AFRAME.utils.extend({}, Body.definition.schema, {
            type: {
                default: "static",
                oneOf: ["static", "dynamic"]
            },
            mass: {
                default: 0
            }
        }),
        module.exports = AFRAME.registerComponent("static-body", StaticBody)
    }
    , {
        "./body": 63
    }],
    66: [function(require, module, exports) {
        var CANNON = require("cannon");
        module.exports = AFRAME.registerComponent("constraint", {
            multiple: !0,
            schema: {
                type: {
                    default: "lock",
                    oneOf: ["coneTwist", "distance", "hinge", "lock", "pointToPoint"]
                },
                target: {
                    type: "selector"
                },
                maxForce: {
                    default: 1e6,
                    min: 0
                },
                collideConnected: {
                    default: !0
                },
                wakeUpBodies: {
                    default: !0
                },
                distance: {
                    default: 0,
                    min: 0
                },
                pivot: {
                    type: "vec3"
                },
                targetPivot: {
                    type: "vec3"
                },
                axis: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 1
                    }
                },
                targetAxis: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 1
                    }
                }
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics,
                this.constraint = null
            },
            remove: function() {
                this.constraint && (this.system.removeConstraint(this.constraint),
                this.constraint = null)
            },
            update: function() {
                var el = this.el
                  , data = this.data;
                this.remove(),
                el.body && data.target.body ? (this.constraint = this.createConstraint(),
                this.system.addConstraint(this.constraint)) : (el.body ? data.target : el).addEventListener("body-loaded", this.update.bind(this, {}))
            },
            createConstraint: function() {
                var constraint, data = this.data, pivot = new CANNON.Vec3(data.pivot.x,data.pivot.y,data.pivot.z), targetPivot = new CANNON.Vec3(data.targetPivot.x,data.targetPivot.y,data.targetPivot.z), axis = new CANNON.Vec3(data.axis.x,data.axis.y,data.axis.z), targetAxis = new CANNON.Vec3(data.targetAxis.x,data.targetAxis.y,data.targetAxis.z);
                switch (data.type) {
                case "lock":
                    (constraint = new CANNON.LockConstraint(this.el.body,data.target.body,{
                        maxForce: data.maxForce
                    })).type = "LockConstraint";
                    break;
                case "distance":
                    (constraint = new CANNON.DistanceConstraint(this.el.body,data.target.body,data.distance,data.maxForce)).type = "DistanceConstraint";
                    break;
                case "hinge":
                    (constraint = new CANNON.HingeConstraint(this.el.body,data.target.body,{
                        pivotA: pivot,
                        pivotB: targetPivot,
                        axisA: axis,
                        axisB: targetAxis,
                        maxForce: data.maxForce
                    })).type = "HingeConstraint";
                    break;
                case "coneTwist":
                    (constraint = new CANNON.ConeTwistConstraint(this.el.body,data.target.body,{
                        pivotA: pivot,
                        pivotB: targetPivot,
                        axisA: axis,
                        axisB: targetAxis,
                        maxForce: data.maxForce
                    })).type = "ConeTwistConstraint";
                    break;
                case "pointToPoint":
                    (constraint = new CANNON.PointToPointConstraint(this.el.body,pivot,data.target.body,targetPivot,data.maxForce)).type = "PointToPointConstraint";
                    break;
                default:
                    throw new Error("[constraint] Unexpected type: " + data.type)
                }
                return constraint.collideConnected = data.collideConnected,
                constraint
            }
        })
    }
    , {
        cannon: 4
    }],
    67: [function(require, module, exports) {
        module.exports = {
            velocity: require("./velocity"),
            registerAll: function(AFRAME) {
                this._registered || ((AFRAME = AFRAME || window.AFRAME).components.velocity || AFRAME.registerComponent("velocity", this.velocity),
                this._registered = !0)
            }
        }
    }
    , {
        "./velocity": 68
    }],
    68: [function(require, module, exports) {
        module.exports = AFRAME.registerComponent("velocity", {
            schema: {
                type: "vec3"
            },
            init: function() {
                this.system = this.el.sceneEl.systems.physics,
                this.system && this.system.addComponent(this)
            },
            remove: function() {
                this.system && this.system.removeComponent(this)
            },
            tick: function(t, dt) {
                dt && (this.system || this.afterStep(t, dt))
            },
            afterStep: function(t, dt) {
                if (dt) {
                    var physics = this.el.sceneEl.systems.physics || {
                        data: {
                            maxInterval: 1 / 60
                        }
                    }
                      , velocity = this.el.getAttribute("velocity") || {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                      , position = this.el.getAttribute("position") || {
                        x: 0,
                        y: 0,
                        z: 0
                    };
                    dt = Math.min(dt, 1e3 * physics.data.maxInterval),
                    this.el.setAttribute("position", {
                        x: position.x + velocity.x * dt / 1e3,
                        y: position.y + velocity.y * dt / 1e3,
                        z: position.z + velocity.z * dt / 1e3
                    })
                }
            }
        })
    }
    , {}],
    69: [function(require, module, exports) {
        var CANNON = require("cannon")
          , Shape = {
            schema: {
                shape: {
                    default: "box",
                    oneOf: ["box", "sphere", "cylinder"]
                },
                offset: {
                    type: "vec3",
                    default: {
                        x: 0,
                        y: 0,
                        z: 0
                    }
                },
                orientation: {
                    type: "vec4",
                    default: {
                        x: 0,
                        y: 0,
                        z: 0,
                        w: 1
                    }
                },
                radius: {
                    type: "number",
                    default: 1,
                    if: {
                        shape: ["sphere"]
                    }
                },
                halfExtents: {
                    type: "vec3",
                    default: {
                        x: 1,
                        y: 1,
                        z: 1
                    },
                    if: {
                        shape: ["box"]
                    }
                },
                radiusTop: {
                    type: "number",
                    default: 1,
                    if: {
                        shape: ["cylinder"]
                    }
                },
                radiusBottom: {
                    type: "number",
                    default: 1,
                    if: {
                        shape: ["cylinder"]
                    }
                },
                height: {
                    type: "number",
                    default: 1,
                    if: {
                        shape: ["cylinder"]
                    }
                },
                numSegments: {
                    type: "int",
                    default: 8,
                    if: {
                        shape: ["cylinder"]
                    }
                }
            },
            multiple: !0,
            init: function() {
                this.el.sceneEl.hasLoaded ? this.initShape() : this.el.sceneEl.addEventListener("loaded", this.initShape.bind(this))
            },
            initShape: function() {
                this.bodyEl = this.el;
                for (var bodyType = this._findType(this.bodyEl), data = this.data; !bodyType && this.bodyEl.parentNode; )
                    this.bodyEl = this.bodyEl.parentNode,
                    bodyType = this._findType(this.bodyEl);
                var scale = new THREE.Vector3;
                this.bodyEl.object3D.getWorldScale(scale);
                var shape, offset, orientation;
                switch (data.hasOwnProperty("offset") && (offset = new CANNON.Vec3(data.offset.x * scale.x,data.offset.y * scale.y,data.offset.z * scale.z)),
                data.hasOwnProperty("orientation") && (orientation = new CANNON.Quaternion).copy(data.orientation),
                data.shape) {
                case "sphere":
                    shape = new CANNON.Sphere(data.radius * scale.x);
                    break;
                case "box":
                    var halfExtents = new CANNON.Vec3(data.halfExtents.x * scale.x,data.halfExtents.y * scale.y,data.halfExtents.z * scale.z);
                    shape = new CANNON.Box(halfExtents);
                    break;
                case "cylinder":
                    shape = new CANNON.Cylinder(data.radiusTop * scale.x,data.radiusBottom * scale.x,data.height * scale.y,data.numSegments);
                    var quat = new CANNON.Quaternion;
                    quat.setFromEuler(90 * THREE.Math.DEG2RAD, 0, 0, "XYZ").normalize(),
                    orientation.mult(quat, orientation);
                    break;
                default:
                    return void console.warn(data.shape + " shape not supported")
                }
                this.bodyEl.components[bodyType].addShape(shape, offset, orientation)
            },
            _findType: function(el) {
                return el.hasAttribute("body") ? "body" : el.hasAttribute("dynamic-body") ? "dynamic-body" : el.hasAttribute("static-body") ? "static-body" : null
            },
            remove: function() {
                this.bodyEl.parentNode && console.warn("removing shape component not currently supported")
            }
        };
        module.exports.definition = Shape,
        module.exports.Component = AFRAME.registerComponent("shape", Shape)
    }
    , {
        cannon: 4
    }],
    70: [function(require, module, exports) {
        module.exports = {
            GRAVITY: -9.8,
            MAX_INTERVAL: 4 / 60,
            ITERATIONS: 10,
            CONTACT_MATERIAL: {
                friction: .01,
                restitution: .3,
                contactEquationStiffness: 1e8,
                contactEquationRelaxation: 3,
                frictionEquationStiffness: 1e8,
                frictionEquationRegularization: 3
            }
        }
    }
    , {}],
    71: [function(require, module, exports) {
        function AmmoDriver() {
            throw new Error("[AmmoDriver] Driver not implemented.")
        }
        var Driver = require("./driver");
        AmmoDriver.prototype = new Driver,
        AmmoDriver.prototype.constructor = AmmoDriver,
        module.exports = AmmoDriver
    }
    , {
        "./driver": 72
    }],
    72: [function(require, module, exports) {
        function Driver() {}
        function abstractMethod() {
            throw new Error("Method not implemented.")
        }
        module.exports = Driver,
        Driver.prototype.init = abstractMethod,
        Driver.prototype.step = abstractMethod,
        Driver.prototype.destroy = abstractMethod,
        Driver.prototype.addBody = abstractMethod,
        Driver.prototype.removeBody = abstractMethod,
        Driver.prototype.applyBodyMethod = abstractMethod,
        Driver.prototype.updateBodyProperties = abstractMethod,
        Driver.prototype.addMaterial = abstractMethod,
        Driver.prototype.addContactMaterial = abstractMethod,
        Driver.prototype.addConstraint = abstractMethod,
        Driver.prototype.removeConstraint = abstractMethod,
        Driver.prototype.getContacts = abstractMethod
    }
    , {}],
    73: [function(require, module, exports) {
        module.exports = {
            INIT: "init",
            STEP: "step",
            ADD_BODY: "add-body",
            REMOVE_BODY: "remove-body",
            APPLY_BODY_METHOD: "apply-body-method",
            UPDATE_BODY_PROPERTIES: "update-body-properties",
            ADD_MATERIAL: "add-material",
            ADD_CONTACT_MATERIAL: "add-contact-material",
            ADD_CONSTRAINT: "add-constraint",
            REMOVE_CONSTRAINT: "remove-constraint"
        }
    }
    , {}],
    74: [function(require, module, exports) {
        function LocalDriver() {
            this.world = null,
            this.materials = {},
            this.contactMaterial = null
        }
        var CANNON = require("cannon")
          , Driver = require("./driver");
        LocalDriver.prototype = new Driver,
        LocalDriver.prototype.constructor = LocalDriver,
        module.exports = LocalDriver,
        LocalDriver.prototype.init = function(worldConfig) {
            var world = new CANNON.World;
            world.quatNormalizeSkip = worldConfig.quatNormalizeSkip,
            world.quatNormalizeFast = worldConfig.quatNormalizeFast,
            world.solver.iterations = worldConfig.solverIterations,
            world.gravity.set(0, worldConfig.gravity, 0),
            world.broadphase = new CANNON.NaiveBroadphase,
            this.world = world
        }
        ,
        LocalDriver.prototype.step = function(deltaMS) {
            this.world.step(deltaMS)
        }
        ,
        LocalDriver.prototype.destroy = function() {
            delete this.world,
            delete this.contactMaterial,
            this.materials = {}
        }
        ,
        LocalDriver.prototype.addBody = function(body) {
            this.world.addBody(body)
        }
        ,
        LocalDriver.prototype.removeBody = function(body) {
            this.world.removeBody(body)
        }
        ,
        LocalDriver.prototype.applyBodyMethod = function(body, methodName, args) {
            body["__" + methodName].apply(body, args)
        }
        ,
        LocalDriver.prototype.updateBodyProperties = function() {}
        ,
        LocalDriver.prototype.getMaterial = function(name) {
            return this.materials[name]
        }
        ,
        LocalDriver.prototype.addMaterial = function(materialConfig) {
            this.materials[materialConfig.name] = new CANNON.Material(materialConfig)
        }
        ,
        LocalDriver.prototype.addContactMaterial = function(matName1, matName2, contactMaterialConfig) {
            var mat1 = this.materials[matName1]
              , mat2 = this.materials[matName2];
            this.contactMaterial = new CANNON.ContactMaterial(mat1,mat2,contactMaterialConfig),
            this.world.addContactMaterial(this.contactMaterial)
        }
        ,
        LocalDriver.prototype.addConstraint = function(constraint) {
            this.world.addConstraint(constraint)
        }
        ,
        LocalDriver.prototype.removeConstraint = function(constraint) {
            this.world.removeConstraint(constraint)
        }
        ,
        LocalDriver.prototype.getContacts = function() {
            return this.world.contacts
        }
    }
    , {
        "./driver": 72,
        cannon: 4
    }],
    75: [function(require, module, exports) {
        function NetworkDriver() {
            throw new Error("[NetworkDriver] Driver not implemented.")
        }
        var Driver = require("./driver");
        NetworkDriver.prototype = new Driver,
        NetworkDriver.prototype.constructor = NetworkDriver,
        module.exports = NetworkDriver
    }
    , {
        "./driver": 72
    }],
    76: [function(require, module, exports) {
        function webworkifyDebug(worker) {
            var targetA = new EventTarget
              , targetB = new EventTarget;
            return targetA.setTarget(targetB),
            targetB.setTarget(targetA),
            worker(targetA),
            targetB
        }
        function EventTarget() {
            this.listeners = []
        }
        module.exports = webworkifyDebug,
        EventTarget.prototype.setTarget = function(target) {
            this.target = target
        }
        ,
        EventTarget.prototype.addEventListener = function(type, fn) {
            this.listeners.push(fn)
        }
        ,
        EventTarget.prototype.dispatchEvent = function(type, event) {
            for (var i = 0; i < this.listeners.length; i++)
                this.listeners[i](event)
        }
        ,
        EventTarget.prototype.postMessage = function(msg) {
            this.target.dispatchEvent("message", {
                data: msg
            })
        }
    }
    , {}],
    77: [function(require, module, exports) {
        function WorkerDriver(options) {
            this.fps = options.fps,
            this.engine = options.engine,
            this.interpolate = options.interpolate,
            this.interpBufferSize = options.interpolationBufferSize,
            this.debug = options.debug,
            this.bodies = {},
            this.contacts = [],
            this.frameDelay = 1e3 * this.interpBufferSize / this.fps,
            this.frameBuffer = [],
            this.worker = this.debug ? webworkifyDebug(worker) : webworkify(worker),
            this.worker.addEventListener("message", this._onMessage.bind(this))
        }
        var webworkify = require("webworkify")
          , webworkifyDebug = require("./webworkify-debug")
          , Driver = require("./driver")
          , Event = require("./event")
          , worker = require("./worker")
          , protocol = require("../utils/protocol")
          , ID = protocol.ID;
        WorkerDriver.prototype = new Driver,
        WorkerDriver.prototype.constructor = WorkerDriver,
        module.exports = WorkerDriver,
        WorkerDriver.prototype.init = function(worldConfig) {
            this.worker.postMessage({
                type: Event.INIT,
                worldConfig: worldConfig,
                fps: this.fps,
                engine: this.engine
            })
        }
        ,
        WorkerDriver.prototype.step = function() {
            if (this.interpolate) {
                for (var prevFrame = this.frameBuffer[0], nextFrame = this.frameBuffer[1], timestamp = performance.now(); prevFrame && nextFrame && timestamp - prevFrame.timestamp > this.frameDelay; )
                    this.frameBuffer.shift(),
                    prevFrame = this.frameBuffer[0],
                    nextFrame = this.frameBuffer[1];
                if (prevFrame && nextFrame) {
                    var mix = (timestamp - prevFrame.timestamp) / this.frameDelay;
                    mix = (mix - (1 - 1 / this.interpBufferSize)) * this.interpBufferSize;
                    for (var id in prevFrame.bodies)
                        prevFrame.bodies.hasOwnProperty(id) && nextFrame.bodies.hasOwnProperty(id) && protocol.deserializeInterpBodyUpdate(prevFrame.bodies[id], nextFrame.bodies[id], this.bodies[id], mix)
                }
            }
        }
        ,
        WorkerDriver.prototype.destroy = function() {
            this.worker.terminate(),
            delete this.worker
        }
        ,
        WorkerDriver.prototype._onMessage = function(event) {
            if (event.data.type !== Event.STEP)
                throw new Error("[WorkerDriver] Unexpected message type.");
            var bodies = event.data.bodies;
            if (this.contacts = event.data.contacts,
            this.interpolate)
                this.frameBuffer.push({
                    timestamp: performance.now(),
                    bodies: bodies
                });
            else
                for (var id in bodies)
                    bodies.hasOwnProperty(id) && protocol.deserializeBodyUpdate(bodies[id], this.bodies[id])
        }
        ,
        WorkerDriver.prototype.addBody = function(body) {
            protocol.assignID("body", body),
            this.bodies[body[ID]] = body,
            this.worker.postMessage({
                type: Event.ADD_BODY,
                body: protocol.serializeBody(body)
            })
        }
        ,
        WorkerDriver.prototype.removeBody = function(body) {
            this.worker.postMessage({
                type: Event.REMOVE_BODY,
                bodyID: body[ID]
            }),
            delete this.bodies[body[ID]]
        }
        ,
        WorkerDriver.prototype.applyBodyMethod = function(body, methodName, args) {
            switch (methodName) {
            case "applyForce":
            case "applyImpulse":
                this.worker.postMessage({
                    type: Event.APPLY_BODY_METHOD,
                    bodyID: body[ID],
                    methodName: methodName,
                    args: [args[0].toArray(), args[1].toArray()]
                });
                break;
            default:
                throw new Error("Unexpected methodName: %s",methodName)
            }
        }
        ,
        WorkerDriver.prototype.updateBodyProperties = function(body) {
            this.worker.postMessage({
                type: Event.UPDATE_BODY_PROPERTIES,
                body: protocol.serializeBody(body)
            })
        }
        ,
        WorkerDriver.prototype.getMaterial = function(name) {}
        ,
        WorkerDriver.prototype.addMaterial = function(materialConfig) {
            this.worker.postMessage({
                type: Event.ADD_MATERIAL,
                materialConfig: materialConfig
            })
        }
        ,
        WorkerDriver.prototype.addContactMaterial = function(matName1, matName2, contactMaterialConfig) {
            this.worker.postMessage({
                type: Event.ADD_CONTACT_MATERIAL,
                materialName1: matName1,
                materialName2: matName2,
                contactMaterialConfig: contactMaterialConfig
            })
        }
        ,
        WorkerDriver.prototype.addConstraint = function(constraint) {
            protocol.assignID("constraint", constraint),
            this.worker.postMessage({
                type: Event.ADD_CONSTRAINT,
                constraint: protocol.serializeConstraint(constraint)
            })
        }
        ,
        WorkerDriver.prototype.removeConstraint = function(constraint) {
            this.worker.postMessage({
                type: Event.REMOVE_CONSTRAINT,
                constraintID: constraint[ID]
            })
        }
        ,
        WorkerDriver.prototype.getContacts = function() {
            var bodies = this.bodies;
            return this.contacts.map(function(message) {
                return protocol.deserializeContact(message, bodies)
            })
        }
    }
    , {
        "../utils/protocol": 81,
        "./driver": 72,
        "./event": 73,
        "./webworkify-debug": 76,
        "./worker": 78,
        webworkify: 62
    }],
    78: [function(require, module, exports) {
        var Event = require("./event")
          , LocalDriver = require("./local-driver")
          , AmmoDriver = require("./ammo-driver")
          , protocol = require("../utils/protocol")
          , ID = protocol.ID;
        module.exports = function(self) {
            function step() {
                driver.step(stepSize);
                var bodyMessages = {};
                Object.keys(bodies).forEach(function(id) {
                    bodyMessages[id] = protocol.serializeBody(bodies[id])
                }),
                self.postMessage({
                    type: Event.STEP,
                    bodies: bodyMessages,
                    contacts: driver.getContacts().map(protocol.serializeContact)
                })
            }
            var stepSize, driver = null, bodies = {}, constraints = {};
            self.addEventListener("message", function(event) {
                var data = event.data;
                switch (data.type) {
                case Event.INIT:
                    (driver = "cannon" === data.engine ? new LocalDriver : new AmmoDriver).init(data.worldConfig),
                    stepSize = 1 / data.fps,
                    setInterval(step, 1e3 / data.fps);
                    break;
                case Event.ADD_BODY:
                    var body = protocol.deserializeBody(data.body);
                    body.material = driver.getMaterial("defaultMaterial"),
                    bodies[body[ID]] = body,
                    driver.addBody(body);
                    break;
                case Event.REMOVE_BODY:
                    driver.removeBody(bodies[data.bodyID]),
                    delete bodies[data.bodyID];
                    break;
                case Event.APPLY_BODY_METHOD:
                    bodies[data.bodyID][data.methodName](protocol.deserializeVec3(data.args[0]), protocol.deserializeVec3(data.args[1]));
                    break;
                case Event.UPDATE_BODY_PROPERTIES:
                    protocol.deserializeBodyUpdate(data.body, bodies[data.body.id]);
                    break;
                case Event.ADD_MATERIAL:
                    driver.addMaterial(data.materialConfig);
                    break;
                case Event.ADD_CONTACT_MATERIAL:
                    driver.addContactMaterial(data.materialName1, data.materialName2, data.contactMaterialConfig);
                    break;
                case Event.ADD_CONSTRAINT:
                    var constraint = protocol.deserializeConstraint(data.constraint, bodies);
                    constraints[constraint[ID]] = constraint,
                    driver.addConstraint(constraint);
                    break;
                case Event.REMOVE_CONSTRAINT:
                    driver.removeConstraint(constraints[data.constraintID]),
                    delete constraints[data.constraintID];
                    break;
                default:
                    throw new Error("[Worker] Unexpected event type: %s",data.type)
                }
            })
        }
    }
    , {
        "../utils/protocol": 81,
        "./ammo-driver": 71,
        "./event": 73,
        "./local-driver": 74
    }],
    79: [function(require, module, exports) {
        var CANNON = require("cannon")
          , CONSTANTS = require("./constants")
          , C_GRAV = CONSTANTS.GRAVITY
          , C_MAT = CONSTANTS.CONTACT_MATERIAL
          , LocalDriver = require("./drivers/local-driver")
          , WorkerDriver = require("./drivers/worker-driver")
          , NetworkDriver = require("./drivers/network-driver");
        require("./drivers/ammo-driver");
        module.exports = AFRAME.registerSystem("physics", {
            schema: {
                driver: {
                    default: "local",
                    oneOf: ["local", "worker", "network", "ammo"]
                },
                networkUrl: {
                    default: "",
                    if: {
                        driver: "network"
                    }
                },
                workerFps: {
                    default: 60,
                    if: {
                        driver: "worker"
                    }
                },
                workerInterpolate: {
                    default: !0,
                    if: {
                        driver: "worker"
                    }
                },
                workerInterpBufferSize: {
                    default: 2,
                    if: {
                        driver: "worker"
                    }
                },
                workerEngine: {
                    default: "cannon",
                    if: {
                        driver: "worker"
                    },
                    oneOf: ["cannon"]
                },
                workerDebug: {
                    default: !1,
                    if: {
                        driver: "worker"
                    }
                },
                gravity: {
                    default: C_GRAV
                },
                iterations: {
                    default: CONSTANTS.ITERATIONS
                },
                friction: {
                    default: C_MAT.friction
                },
                restitution: {
                    default: C_MAT.restitution
                },
                contactEquationStiffness: {
                    default: C_MAT.contactEquationStiffness
                },
                contactEquationRelaxation: {
                    default: C_MAT.contactEquationRelaxation
                },
                frictionEquationStiffness: {
                    default: C_MAT.frictionEquationStiffness
                },
                frictionEquationRegularization: {
                    default: C_MAT.frictionEquationRegularization
                },
                maxInterval: {
                    default: 4 / 60
                },
                debug: {
                    default: !1
                }
            },
            init: function() {
                var data = this.data;
                switch (this.debug = data.debug,
                this.callbacks = {
                    beforeStep: [],
                    step: [],
                    afterStep: []
                },
                this.listeners = {},
                this.driver = null,
                data.driver) {
                case "local":
                    this.driver = new LocalDriver;
                    break;
                case "network":
                    this.driver = new NetworkDriver(data.networkUrl);
                    break;
                case "worker":
                    this.driver = new WorkerDriver({
                        fps: data.workerFps,
                        engine: data.workerEngine,
                        interpolate: data.workerInterpolate,
                        interpolationBufferSize: data.workerInterpBufferSize,
                        debug: data.workerDebug
                    });
                    break;
                default:
                    throw new Error('[physics] Driver not recognized: "%s".',data.driver)
                }
                this.driver.init({
                    quatNormalizeSkip: 0,
                    quatNormalizeFast: !1,
                    solverIterations: data.iterations,
                    gravity: data.gravity
                }),
                this.driver.addMaterial({
                    name: "defaultMaterial"
                }),
                this.driver.addContactMaterial("defaultMaterial", "defaultMaterial", {
                    friction: data.friction,
                    restitution: data.restitution,
                    contactEquationStiffness: data.contactEquationStiffness,
                    contactEquationRelaxation: data.contactEquationRelaxation,
                    frictionEquationStiffness: data.frictionEquationStiffness,
                    frictionEquationRegularization: data.frictionEquationRegularization
                })
            },
            tick: function(t, dt) {
                if (dt) {
                    var i, callbacks = this.callbacks;
                    for (i = 0; i < this.callbacks.beforeStep.length; i++)
                        this.callbacks.beforeStep[i].beforeStep(t, dt);
                    for (this.driver.step(Math.min(dt / 1e3, this.data.maxInterval)),
                    i = 0; i < callbacks.step.length; i++)
                        callbacks.step[i].step(t, dt);
                    for (i = 0; i < callbacks.afterStep.length; i++)
                        callbacks.afterStep[i].afterStep(t, dt)
                }
            },
            addBody: function(body) {
                var driver = this.driver;
                body.__applyImpulse = body.applyImpulse,
                body.applyImpulse = function() {
                    driver.applyBodyMethod(body, "applyImpulse", arguments)
                }
                ,
                body.__applyForce = body.applyForce,
                body.applyForce = function() {
                    driver.applyBodyMethod(body, "applyForce", arguments)
                }
                ,
                body.updateProperties = function() {
                    driver.updateBodyProperties(body)
                }
                ,
                this.listeners[body.id] = function(e) {
                    body.el.emit("collide", e)
                }
                ,
                body.addEventListener("collide", this.listeners[body.id]),
                this.driver.addBody(body)
            },
            removeBody: function(body) {
                this.driver.removeBody(body),
                body.removeEventListener("collide", this.listeners[body.id]),
                delete this.listeners[body.id],
                body.applyImpulse = body.__applyImpulse,
                delete body.__applyImpulse,
                body.applyForce = body.__applyForce,
                delete body.__applyForce,
                delete body.updateProperties
            },
            addConstraint: function(constraint) {
                constraint.type || (constraint instanceof CANNON.LockConstraint ? constraint.type = "LockConstraint" : constraint instanceof CANNON.DistanceConstraint ? constraint.type = "DistanceConstraint" : constraint instanceof CANNON.HingeConstraint ? constraint.type = "HingeConstraint" : constraint instanceof CANNON.ConeTwistConstraint ? constraint.type = "ConeTwistConstraint" : constraint instanceof CANNON.PointToPointConstraint && (constraint.type = "PointToPointConstraint")),
                this.driver.addConstraint(constraint)
            },
            removeConstraint: function(constraint) {
                this.driver.removeConstraint(constraint)
            },
            addComponent: function(component) {
                var callbacks = this.callbacks;
                component.beforeStep && callbacks.beforeStep.push(component),
                component.step && callbacks.step.push(component),
                component.afterStep && callbacks.afterStep.push(component)
            },
            removeComponent: function(component) {
                var callbacks = this.callbacks;
                component.beforeStep && callbacks.beforeStep.splice(callbacks.beforeStep.indexOf(component), 1),
                component.step && callbacks.step.splice(callbacks.step.indexOf(component), 1),
                component.afterStep && callbacks.afterStep.splice(callbacks.afterStep.indexOf(component), 1)
            },
            getContacts: function() {
                return this.driver.getContacts()
            },
            getMaterial: function(name) {
                return this.driver.getMaterial(name)
            }
        })
    }
    , {
        "./constants": 70,
        "./drivers/ammo-driver": 71,
        "./drivers/local-driver": 74,
        "./drivers/network-driver": 75,
        "./drivers/worker-driver": 77,
        cannon: 4
    }],
    80: [function(require, module, exports) {
        module.exports.slerp = function(a, b, t) {
            if (t <= 0)
                return a;
            if (t >= 1)
                return b;
            var x = a[0]
              , y = a[1]
              , z = a[2]
              , w = a[3]
              , cosHalfTheta = w * b[3] + x * b[0] + y * b[1] + z * b[2];
            if (!(cosHalfTheta < 0))
                return b;
            if ((a = a.slice())[3] = -b[3],
            a[0] = -b[0],
            a[1] = -b[1],
            a[2] = -b[2],
            (cosHalfTheta = -cosHalfTheta) >= 1)
                return a[3] = w,
                a[0] = x,
                a[1] = y,
                a[2] = z,
                this;
            var sinHalfTheta = Math.sqrt(1 - cosHalfTheta * cosHalfTheta);
            if (Math.abs(sinHalfTheta) < .001)
                return a[3] = .5 * (w + a[3]),
                a[0] = .5 * (x + a[0]),
                a[1] = .5 * (y + a[1]),
                a[2] = .5 * (z + a[2]),
                this;
            var halfTheta = Math.atan2(sinHalfTheta, cosHalfTheta)
              , ratioA = Math.sin((1 - t) * halfTheta) / sinHalfTheta
              , ratioB = Math.sin(t * halfTheta) / sinHalfTheta;
            return a[3] = w * ratioA + a[3] * ratioB,
            a[0] = x * ratioA + a[0] * ratioB,
            a[1] = y * ratioA + a[1] * ratioB,
            a[2] = z * ratioA + a[2] * ratioB,
            a
        }
    }
    , {}],
    81: [function(require, module, exports) {
        function serializeShape(shape) {
            var shapeMsg = {
                type: shape.type
            };
            if (shape.type === CANNON.Shape.types.BOX)
                shapeMsg.halfExtents = serializeVec3(shape.halfExtents);
            else if (shape.type === CANNON.Shape.types.SPHERE)
                shapeMsg.radius = shape.radius;
            else {
                if (shape._type !== CANNON.Shape.types.CYLINDER)
                    throw new Error("Unimplemented shape type: %s",shape.type);
                shapeMsg.type = CANNON.Shape.types.CYLINDER,
                shapeMsg.radiusTop = shape.radiusTop,
                shapeMsg.radiusBottom = shape.radiusBottom,
                shapeMsg.height = shape.height,
                shapeMsg.numSegments = shape.numSegments
            }
            return shapeMsg
        }
        function deserializeShape(message) {
            var shape;
            if (message.type === CANNON.Shape.types.BOX)
                shape = new CANNON.Box(deserializeVec3(message.halfExtents));
            else if (message.type === CANNON.Shape.types.SPHERE)
                shape = new CANNON.Sphere(message.radius);
            else {
                if (message.type !== CANNON.Shape.types.CYLINDER)
                    throw new Error("Unimplemented shape type: %s",message.type);
                (shape = new CANNON.Cylinder(message.radiusTop,message.radiusBottom,message.height,message.numSegments))._type = CANNON.Shape.types.CYLINDER
            }
            return shape
        }
        function serializeVec3(vec3) {
            return vec3.toArray()
        }
        function deserializeVec3(message) {
            return new CANNON.Vec3(message[0],message[1],message[2])
        }
        function serializeQuaternion(quat) {
            return quat.toArray()
        }
        function deserializeQuaternion(message) {
            return new CANNON.Quaternion(message[0],message[1],message[2],message[3])
        }
        var CANNON = require("cannon")
          , mathUtils = require("./math")
          , ID = "__id";
        module.exports.ID = ID;
        var nextID = {};
        module.exports.assignID = function(prefix, object) {
            object[ID] || (nextID[prefix] = nextID[prefix] || 1,
            object[ID] = prefix + "_" + nextID[prefix]++)
        }
        ,
        module.exports.serializeBody = function(body) {
            return {
                shapes: body.shapes.map(serializeShape),
                shapeOffsets: body.shapeOffsets.map(serializeVec3),
                shapeOrientations: body.shapeOrientations.map(serializeQuaternion),
                position: serializeVec3(body.position),
                quaternion: body.quaternion.toArray(),
                velocity: serializeVec3(body.velocity),
                angularVelocity: serializeVec3(body.angularVelocity),
                id: body[ID],
                mass: body.mass,
                linearDamping: body.linearDamping,
                angularDamping: body.angularDamping,
                fixedRotation: body.fixedRotation,
                allowSleep: body.allowSleep,
                sleepSpeedLimit: body.sleepSpeedLimit,
                sleepTimeLimit: body.sleepTimeLimit
            }
        }
        ,
        module.exports.deserializeBodyUpdate = function(message, body) {
            return body.position.set(message.position[0], message.position[1], message.position[2]),
            body.quaternion.set(message.quaternion[0], message.quaternion[1], message.quaternion[2], message.quaternion[3]),
            body.velocity.set(message.velocity[0], message.velocity[1], message.velocity[2]),
            body.angularVelocity.set(message.angularVelocity[0], message.angularVelocity[1], message.angularVelocity[2]),
            body.linearDamping = message.linearDamping,
            body.angularDamping = message.angularDamping,
            body.fixedRotation = message.fixedRotation,
            body.allowSleep = message.allowSleep,
            body.sleepSpeedLimit = message.sleepSpeedLimit,
            body.sleepTimeLimit = message.sleepTimeLimit,
            body.mass !== message.mass && (body.mass = message.mass,
            body.updateMassProperties()),
            body
        }
        ,
        module.exports.deserializeInterpBodyUpdate = function(message1, message2, body, mix) {
            var weight1 = 1 - mix
              , weight2 = mix;
            body.position.set(message1.position[0] * weight1 + message2.position[0] * weight2, message1.position[1] * weight1 + message2.position[1] * weight2, message1.position[2] * weight1 + message2.position[2] * weight2);
            var quaternion = mathUtils.slerp(message1.quaternion, message2.quaternion, mix);
            return body.quaternion.set(quaternion[0], quaternion[1], quaternion[2], quaternion[3]),
            body.velocity.set(message1.velocity[0] * weight1 + message2.velocity[0] * weight2, message1.velocity[1] * weight1 + message2.velocity[1] * weight2, message1.velocity[2] * weight1 + message2.velocity[2] * weight2),
            body.angularVelocity.set(message1.angularVelocity[0] * weight1 + message2.angularVelocity[0] * weight2, message1.angularVelocity[1] * weight1 + message2.angularVelocity[1] * weight2, message1.angularVelocity[2] * weight1 + message2.angularVelocity[2] * weight2),
            body.linearDamping = message2.linearDamping,
            body.angularDamping = message2.angularDamping,
            body.fixedRotation = message2.fixedRotation,
            body.allowSleep = message2.allowSleep,
            body.sleepSpeedLimit = message2.sleepSpeedLimit,
            body.sleepTimeLimit = message2.sleepTimeLimit,
            body.mass !== message2.mass && (body.mass = message2.mass,
            body.updateMassProperties()),
            body
        }
        ,
        module.exports.deserializeBody = function(message) {
            for (var shapeMsg, body = new CANNON.Body({
                mass: message.mass,
                position: deserializeVec3(message.position),
                quaternion: deserializeQuaternion(message.quaternion),
                velocity: deserializeVec3(message.velocity),
                angularVelocity: deserializeVec3(message.angularVelocity),
                linearDamping: message.linearDamping,
                angularDamping: message.angularDamping,
                fixedRotation: message.fixedRotation,
                allowSleep: message.allowSleep,
                sleepSpeedLimit: message.sleepSpeedLimit,
                sleepTimeLimit: message.sleepTimeLimit
            }), i = 0; shapeMsg = message.shapes[i]; i++)
                body.addShape(deserializeShape(shapeMsg), deserializeVec3(message.shapeOffsets[i]), deserializeQuaternion(message.shapeOrientations[i]));
            return body[ID] = message.id,
            body
        }
        ,
        module.exports.serializeShape = serializeShape,
        module.exports.deserializeShape = deserializeShape,
        module.exports.serializeConstraint = function(constraint) {
            var message = {
                id: constraint[ID],
                type: constraint.type,
                maxForce: constraint.maxForce,
                bodyA: constraint.bodyA[ID],
                bodyB: constraint.bodyB[ID]
            };
            switch (constraint.type) {
            case "LockConstraint":
                break;
            case "DistanceConstraint":
                message.distance = constraint.distance;
                break;
            case "HingeConstraint":
            case "ConeTwistConstraint":
                message.axisA = serializeVec3(constraint.axisA),
                message.axisB = serializeVec3(constraint.axisB),
                message.pivotA = serializeVec3(constraint.pivotA),
                message.pivotB = serializeVec3(constraint.pivotB);
                break;
            case "PointToPointConstraint":
                message.pivotA = serializeVec3(constraint.pivotA),
                message.pivotB = serializeVec3(constraint.pivotB);
                break;
            default:
                throw new Error("Unexpected constraint type: " + constraint.type + '. You may need to manually set `constraint.type = "FooConstraint";`.')
            }
            return message
        }
        ,
        module.exports.deserializeConstraint = function(message, bodies) {
            var constraint, TypedConstraint = CANNON[message.type], bodyA = bodies[message.bodyA], bodyB = bodies[message.bodyB];
            switch (message.type) {
            case "LockConstraint":
                constraint = new CANNON.LockConstraint(bodyA,bodyB,message);
                break;
            case "DistanceConstraint":
                constraint = new CANNON.DistanceConstraint(bodyA,bodyB,message.distance,message.maxForce);
                break;
            case "HingeConstraint":
            case "ConeTwistConstraint":
                constraint = new TypedConstraint(bodyA,bodyB,{
                    pivotA: deserializeVec3(message.pivotA),
                    pivotB: deserializeVec3(message.pivotB),
                    axisA: deserializeVec3(message.axisA),
                    axisB: deserializeVec3(message.axisB),
                    maxForce: message.maxForce
                });
                break;
            case "PointToPointConstraint":
                constraint = new CANNON.PointToPointConstraint(bodyA,deserializeVec3(message.pivotA),bodyB,deserializeVec3(message.pivotB),message.maxForce);
                break;
            default:
                throw new Error("Unexpected constraint type: " + message.type)
            }
            return constraint[ID] = message.id,
            constraint
        }
        ,
        module.exports.serializeContact = function(contact) {
            return {
                bi: contact.bi[ID],
                bj: contact.bj[ID],
                ni: serializeVec3(contact.ni),
                ri: serializeVec3(contact.ri),
                rj: serializeVec3(contact.rj)
            }
        }
        ,
        module.exports.deserializeContact = function(message, bodies) {
            return {
                bi: bodies[message.bi],
                bj: bodies[message.bj],
                ni: deserializeVec3(message.ni),
                ri: deserializeVec3(message.ri),
                rj: deserializeVec3(message.rj)
            }
        }
        ,
        module.exports.serializeVec3 = serializeVec3,
        module.exports.deserializeVec3 = deserializeVec3,
        module.exports.serializeQuaternion = serializeQuaternion,
        module.exports.deserializeQuaternion = deserializeQuaternion
    }
    , {
        "./math": 80,
        cannon: 4
    }]
}, {}, [1]);
