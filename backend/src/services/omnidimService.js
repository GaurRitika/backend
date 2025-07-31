const https = require('https');
const http = require('http');
const { URL } = require('url');

class OmniDIMService {
  constructor() {
    this.apiKey = process.env.OMNIDIM_API_KEY;
    this.baseUrl = process.env.OMNIDIM_API_URL || 'https://api.omnidim.io';
    this.agentId = process.env.OMNIDIM_AGENT_ID;
  }

  // Helper function to make HTTP requests
  async makeRequest(url, options = {}) {
    return new Promise((resolve, reject) => {
      const urlObj = new URL(url);
      const isHttps = urlObj.protocol === 'https:';
      const client = isHttps ? https : http;
      
      const requestOptions = {
        hostname: urlObj.hostname,
        port: urlObj.port || (isHttps ? 443 : 80),
        path: urlObj.pathname + urlObj.search,
        method: options.method || 'GET',
        headers: {
          'Content-Type': 'application/json',
          ...options.headers
        }
      };

      const req = client.request(requestOptions, (res) => {
        let data = '';
        res.on('data', (chunk) => {
          data += chunk;
        });
        res.on('end', () => {
          try {
            const jsonData = JSON.parse(data);
            resolve({ status: res.statusCode, data: jsonData });
          } catch (error) {
            resolve({ status: res.statusCode, data: data });
          }
        });
      });

      req.on('error', (error) => {
        reject(error);
      });

      if (options.body) {
        req.write(options.body);
      }
      req.end();
    });
  }

  // Initiate a voice call to a phone number
  async initiateCall(phoneNumber, variables = {}) {
    try {
      const payload = {
        phone_number: phoneNumber,
        agent_id: this.agentId,
        webhook_url: `${process.env.BASE_URL}/api/omnidim/webhook`,
        variables: variables
      };

      const response = await this.makeRequest(`${this.baseUrl}/calls/initiate`, {
        method: 'POST',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        },
        body: JSON.stringify(payload)
      });

      if (response.status >= 400) {
        throw new Error(`OmniDIM API error: ${response.status}`);
      }

      console.log('OmniDIM call initiated:', response.data);
      return response.data;
    } catch (error) {
      console.error('Error initiating OmniDIM call:', error);
      throw error;
    }
  }

  // Get call status
  async getCallStatus(callId) {
    try {
      const response = await this.makeRequest(`${this.baseUrl}/calls/${callId}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (response.status >= 400) {
        throw new Error(`OmniDIM API error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error getting call status:', error);
      throw error;
    }
  }

  // Get agent information
  async getAgentInfo(agentId = null) {
    try {
      const id = agentId || this.agentId;
      const response = await this.makeRequest(`${this.baseUrl}/agents/${id}`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${this.apiKey}`
        }
      });

      if (response.status >= 400) {
        throw new Error(`OmniDIM API error: ${response.status}`);
      }

      return response.data;
    } catch (error) {
      console.error('Error getting agent info:', error);
      throw error;
    }
  }

  // Validate webhook signature (if OmniDIM provides webhook signing)
  validateWebhookSignature(payload, signature, timestamp) {
    // TODO: Implement webhook signature validation if OmniDIM provides it
    // This is a security best practice for webhook endpoints
    return true; // Placeholder
  }
}

module.exports = new OmniDIMService();