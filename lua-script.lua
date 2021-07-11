--[[
MIT License

Copyright (c) 2020 yogurtsyum

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in all
copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN THE
SOFTWARE.
--]]

local groupId = 123;
local requiredRank = 255;
local server = 'URL'
local HttpService = game:GetService('HttpService')
local key = 'key'

function slice(tbl, first, last, step)
  local sliced = {}

  for i = first or 1, last or #tbl, step or 1 do
    sliced[#sliced+1] = tbl[i]
  end

  return sliced
end

game.Players.PlayerAdded:Connect(function(player)
	player.Chatted:Connect(function(msg)
		local args = msg:split(" ")
		if args[1] == "!setrank" then
			local user = args[2]
			local rank = slice(args, 3)
			rank = table.concat(rank, ' ')
			if(user and rank) then
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					local res = HttpService:PostAsync(server..'setrank', HttpService:JSONEncode({
						user = user,
						rank = rank,
						author = player.Name,
						key = key
					}))
				end
			end
		elseif args[1] == "!promote" then
			local user = args[2]
			if(user) then
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					local res = HttpService:PostAsync(server..'promote', HttpService:JSONEncode({
						user = user,
						author = player.Name,
						key = key
					}))
				end
			end
		elseif args[1] == "!demote" then
			local user = args[2]
			if(user) then
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					local res = HttpService:PostAsync(server..'demote', HttpService:JSONEncode({
						user = user,
						author = player.Name,
						key = key
					}))
				end
			end
		elseif args[1] == "!fire" then
			local user = args[2]
			if(user) then
				if(player:GetRankInGroup(groupId) >= requiredRank) then
					local res = HttpService:PostAsync(server..'fire', HttpService:JSONEncode({
						user = user,
						author = player.Name,
						key = key
					}))
				end
			end
		elseif args[1] == "!shout" then
			table.remove(args, 1)
			local msg = table.concat(args, ' ')
			if(player:GetRankInGroup(groupId) >= requiredRank) then
				local res = HttpService:PostAsync(server..'shout', HttpService:JSONEncode({
						msg = msg,
						author = player.Name,
						key = key
					}))
			end
		end
	end)
end)
