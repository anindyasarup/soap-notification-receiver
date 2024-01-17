import express from "express";

import {XMLParser, XMLBuilder} from "fast-xml-parser";


const xmlParser = new XMLParser({
    ignoreAttributes: false
});

const xmlBuilder = new XMLBuilder({
    ignoreAttributes: false
});

const app = express();
const port = 8080;

app.get('/health', (req, res) => {
    const healthStatus = {
        status: 'ok',
        version: '1.0.0',
        timestamp: new Date().toISOString()
    };

    const res_xml = xmlBuilder.build({healthStatus: healthStatus});
    res.set('Content-Type', 'application/xml');
    res.status(200).send(res_xml);
});

app.post(
    '/event-receiver',
    express.raw({
        inflate: true,
        limit: '100kb',
        type: () => true
    }),
    (req, res) => {
        const event = req.body.toString();

        const eventNotification = {
            status: 'ok',
            version: '1.0.0',
            timestamp: new Date().toISOString(),
            message: 'XML received successfully'
        };

        console.log(xmlParser.parse(event))

        const res_xml = xmlBuilder.build({eventNotification: eventNotification});
        res.set('Content-Type', 'application/xml');
        res.status(200).send(res_xml);
    })

app.listen(port, () => {
    console.log(`Server is running on http://localhost:${port}`);
})