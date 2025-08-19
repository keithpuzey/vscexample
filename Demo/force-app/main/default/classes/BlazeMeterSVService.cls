public with sharing class BlazeMeterSVService {

    @AuraEnabled(cacheable=false)
    public static List<Map<String, Object>> getAccountData(String accountId) {
        Http http = new Http();
        HttpRequest request = new HttpRequest();
        request.setEndpoint('https://vs250231svc410236.mock.blazemeter.com/api/data');
        request.setMethod('POST');
        request.setHeader('Content-Type', 'application/json');

        // Create the JSON body
        Map<String, String> bodyMap = new Map<String, String>();
        bodyMap.put('accountId', accountId);
        String body = JSON.serialize(bodyMap);

        request.setBody(body);

        HttpResponse response = http.send(request);

        if (response.getStatusCode() == 200) {
            // Parse response JSON into List<Map<String,Object>>
            List<Object> rawList = (List<Object>) JSON.deserializeUntyped(response.getBody());
            List<Map<String,Object>> result = new List<Map<String,Object>>();
            for (Object item : rawList) {
                result.add((Map<String,Object>) item);
            }
            return result;
        } else {
            throw new AuraHandledException('Failed to call SV: ' + response.getStatus());
        }
    }
}
 //      request.setEndpoint('http://dbank329154.mock.blazemeter.com/api/data');