public with sharing class UpdateContractController {
    @AuraEnabled
    public static String updateContractValue(String accountId, String value) {
        Http http = new Http();
        HttpRequest req = new HttpRequest();
        req.setEndpoint('https://vs250231svc410236.mock.blazemeter.com/api/data'); // replace with your SV PUT URL
        req.setMethod('PUT');
        req.setHeader('Content-Type', 'application/json');

        Map<String, Object> body = new Map<String, Object>();
        body.put('accountId', accountId);
        body.put('contractValue', value);
        req.setBody(JSON.serialize(body));

        HttpResponse res = http.send(req);
        if(res.getStatusCode() >= 200 && res.getStatusCode() < 300) {
            return 'Success: ' + res.getBody();
        } else {
            throw new AuraHandledException('Error: ' + res.getBody());
        }
    }
}