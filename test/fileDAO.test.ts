import { Model } from "../src/entities/model";
import { ModelComponent } from "../src/entities/modelTaskMetadata";
import { FileDAO, FileModule } from "../src/persistence/fileDAO";
import { GraphParser } from "../src/persistence/graphParser";
import { Component } from "../src/persistence/component";

describe("FileDAO Class", () => {
    it("should create a new file.",
       () => {
            let label = ModelComponent.DataGraph;
            let filename = "insert.ttl";
            let file = new Blob([]); // blob is unnecessary for saving to file
            let module = new FileModule(label, filename, file);

            let model = new Model();
            let parser = new GraphParser();
            let comp = new Component();
            let busy = true;
            parser.parse(generateTurtle(), "text/turtle", function(result: any) {
                comp.setPart(filename, result);
                model.tasks.schedule(
                    Model.createTask(
                        (data) => {
                            data.setComponent(ModelComponent.DataGraph, comp);
                            busy = false;
                        },
                        [],
                        [ModelComponent.DataGraph]));
                model.tasks.processTask();

                // this is pretty horrible and there probably exists a better way of doing this,
                // but at the moment I can't seem to think of one
                while (busy) {}

                // no idea how to automatically check whether the file was actually created,
                // as this would require rummaging the user's file system
                let dao = new FileDAO(model);
                dao.insert(module);
            });
        });

    it("should load an existing file.",
       (done) => {
           let label = ModelComponent.DataGraph;
           let filename = "find.ttl";
           let file = new Blob([generateTurtle()]);
           let module = new FileModule(label, filename, file);

           let model = new Model();
           model.registerObserver((changeBuf) => {
               expect(changeBuf.contains(ModelComponent.DataGraph)).toEqual(true);
               done();
               return [];
           });

           let dao = new FileDAO(model);
           dao.find(module);
       });
});

function generateTurtle() {
    return "@prefix dc: <http://purl.org/dc/elements/1.1/>.\n" +
        "<http://en.wikipedia.org/wiki/Tony_Benn>\n" +
        'dc:title "Tony Benn";\n' +
        'dc:publisher "Wikipedia".';
}